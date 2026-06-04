import {
  CallHandler,
  ExecutionContext,
  GatewayTimeoutException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';
import { REQUEST_TIMEOUT_METADATA } from './request-timeout.decorator';
import { ResilienceConfigService } from '../resilience.config';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ResilienceConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const timeoutMs =
      this.reflector.getAllAndOverride<number>(REQUEST_TIMEOUT_METADATA, [
        context.getHandler(),
        context.getClass(),
      ]) ?? this.config.timeout.defaultMs;

    return next.handle().pipe(
      timeout(timeoutMs),
      catchError((error: unknown) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () =>
              new GatewayTimeoutException(
                `Tempo limite da requisição excedido (${timeoutMs} ms).`,
              ),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
