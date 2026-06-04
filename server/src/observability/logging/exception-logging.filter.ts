import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { MetricsService } from '../metrics/metrics.service';
import { RequestContextHttpRequest } from '../tracing/request-context.types';

@Catch()
export class ExceptionLoggingFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(
    adapterHost: HttpAdapterHost,
    private readonly logger: PinoLogger,
    private readonly metrics: MetricsService,
  ) {
    super(adapterHost.httpAdapter);
    this.logger.setContext(ExceptionLoggingFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      super.catch(exception, host);
      return;
    }

    const http = host.switchToHttp();
    const request = http.getRequest<Request & RequestContextHttpRequest>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof Error ? exception : new Error(String(exception));

    this.metrics.recordApplicationError(
      request.method,
      this.resolveRoute(request),
      statusCode,
      error.name,
    );

    this.logger.error(
      {
        requestId: request.requestId ?? request.id,
        correlationId: request.correlationId,
        traceId: request.traceId,
        spanId: request.spanId,
        method: request.method,
        route: this.resolveRoute(request),
        statusCode,
        stack: error.stack,
        errorName: error.name,
      },
      error.message,
    );

    super.catch(exception, host);
  }

  private resolveRoute(request: Request): string {
    const routePath = request.route?.path;
    if (typeof routePath === 'string') {
      return `${request.baseUrl ?? ''}${routePath}` || '/';
    }
    return (request.originalUrl || request.url || 'unknown').split('?')[0];
  }
}
