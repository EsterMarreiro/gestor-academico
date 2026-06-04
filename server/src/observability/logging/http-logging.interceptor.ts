import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';
import { RequestContextHttpRequest } from '../tracing/request-context.types';
import { RequestContextService } from '../tracing/request-context.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private readonly metrics: MetricsService,
    private readonly requestContext: RequestContextService,
  ) {
    this.logger.setContext(HttpLoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request & RequestContextHttpRequest>();
    const response = http.getResponse<Response>();
    const startedAt = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        this.logResponse(request, response, startedAt);
      }),
      catchError((error: unknown) => {
        this.logResponse(request, response, startedAt, error);
        return throwError(() => error);
      }),
    );
  }

  private logResponse(
    request: Request & RequestContextHttpRequest,
    response: Response,
    startedAt: bigint,
    error?: unknown,
  ): void {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const route = this.resolveRoute(request);
    const statusCode = this.resolveStatusCode(response.statusCode, error);
    const requestId =
      this.requestContext.getRequestId() ?? request.requestId ?? request.id;

    this.metrics.recordHttpRequest(
      request.method,
      route,
      statusCode,
      durationMs,
    );

    const payload = {
      requestId,
      correlationId: request.correlationId,
      traceId: request.traceId,
      spanId: request.spanId,
      method: request.method,
      route,
      statusCode,
      responseTimeMs: Number(durationMs.toFixed(3)),
    };

    if (statusCode >= 500) {
      this.logger.error(payload, 'HTTP request failed');
      return;
    }

    if (statusCode >= 400) {
      this.logger.warn(payload, 'HTTP request completed with client error');
      return;
    }

    this.logger.info(payload, 'HTTP request completed');
  }

  private resolveRoute(request: Request): string {
    const routePath = request.route?.path;
    if (typeof routePath === 'string') {
      return `${request.baseUrl ?? ''}${routePath}` || '/';
    }

    return (request.originalUrl || request.url || 'unknown').split('?')[0];
  }

  private resolveStatusCode(
    currentStatusCode: number,
    error?: unknown,
  ): number {
    if (!error) {
      return currentStatusCode;
    }
    return currentStatusCode >= 400 ? currentStatusCode : 500;
  }
}
