import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.record(request, response.statusCode, startedAt);
      }),
      catchError((error: unknown) => {
        this.record(
          request,
          this.resolveStatusCode(error, response.statusCode),
          startedAt,
        );
        return throwError(() => error);
      }),
    );
  }

  private record(
    request: Request,
    statusCode: number,
    startedAt: number,
  ): void {
    this.metricsService.recordHttpRequest(
      request.method,
      this.resolveRoute(request),
      statusCode,
      Date.now() - startedAt,
    );
  }

  private resolveRoute(request: Request): string {
    const routePath = request.route?.path;
    if (typeof routePath === 'string') {
      return `${request.baseUrl ?? ''}${routePath}` || '/';
    }

    return (request.originalUrl || request.url || 'unknown').split('?')[0];
  }

  private resolveStatusCode(error: unknown, currentStatusCode: number): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }

    return currentStatusCode >= 400 ? currentStatusCode : 500;
  }
}
