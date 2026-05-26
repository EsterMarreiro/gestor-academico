import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();
    const path = request.originalUrl || request.url;

    return next.handle().pipe(
      tap(() => {
        this.logRequest(request.method, path, response.statusCode, startedAt);
      }),
      catchError((error: unknown) => {
        this.logRequest(
          request.method,
          path,
          this.resolveStatusCode(error, response.statusCode),
          startedAt,
        );
        return throwError(() => error);
      }),
    );
  }

  private logRequest(
    method: string,
    path: string,
    statusCode: number,
    startedAt: number,
  ): void {
    const durationMs = Date.now() - startedAt;
    const message = `${method} ${path} ${statusCode} - ${durationMs}ms`;

    if (statusCode >= 500) {
      this.logger.error(message);
      return;
    }

    if (statusCode >= 400) {
      this.logger.warn(message);
      return;
    }

    this.logger.log(message);
  }

  private resolveStatusCode(error: unknown, currentStatusCode: number): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }

    return currentStatusCode >= 400 ? currentStatusCode : 500;
  }
}
