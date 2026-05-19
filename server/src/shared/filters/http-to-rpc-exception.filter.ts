import {
  ArgumentsHost,
  Catch,
  HttpException,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

function responseMessage(response: string | object): string {
  if (typeof response === 'string') {
    return response;
  }
  const r = response as Record<string, unknown>;
  const m = r['message'];
  if (Array.isArray(m)) {
    return m.map(String).join('; ');
  }
  if (typeof m === 'string') {
    return m;
  }
  return JSON.stringify(r);
}

/**
 * Garante que exceções HTTP do domínio chegam ao ClientProxy TCP com
 * `{ statusCode, message }`, para o gateway interpretar (sendRpc / unwrap).
 */
@Catch()
export class HttpToRpcExceptionFilter implements RpcExceptionFilter<unknown> {
  private readonly logger = new Logger(HttpToRpcExceptionFilter.name);

  catch(exception: unknown, _host: ArgumentsHost): Observable<never> {
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();
      const message = typeof body === 'string' ? body : responseMessage(body);
      return throwError(() => new RpcException({ statusCode, message }));
    }
    const err =
      exception instanceof Error ? exception : new Error(String(exception));
    this.logger.error(err.stack ?? err.message);
    return throwError(
      () =>
        new RpcException({
          statusCode: 500,
          message: err.message || 'Internal server error',
        }),
    );
  }
}
