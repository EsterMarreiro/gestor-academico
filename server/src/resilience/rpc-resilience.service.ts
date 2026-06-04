import {
  GatewayTimeoutException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { BulkheadService } from './bulkhead/bulkhead.service';
import { CircuitBreakerService } from './circuit-breaker/circuit-breaker.service';
import { ResilienceConfigService } from './resilience.config';
import { RetryService } from './retry/retry.service';

const TCP_DOWN_HINT =
  'Microserviço TCP indisponível ou ligação falhou. Na pasta server execute `npm run start:dev` ou verifique os containers correspondentes.';

@Injectable()
export class RpcResilienceService {
  constructor(
    private readonly bulkhead: BulkheadService,
    private readonly breaker: CircuitBreakerService,
    private readonly retry: RetryService,
    private readonly config: ResilienceConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RpcResilienceService.name);
  }

  async send<T>(
    client: ClientProxy,
    pattern: string,
    payload: unknown,
    dependency: string,
  ): Promise<T> {
    return this.bulkhead.run(dependency, () =>
      this.breaker.execute(dependency, () =>
        this.retry.execute(
          async () => {
            try {
              return await firstValueFrom(
                client
                  .send<T>(pattern, payload)
                  .pipe(timeout(this.config.timeout.rpcMs)),
              );
            } catch (error) {
              throw this.unwrapError(error);
            }
          },
          (error) => this.shouldRetry(error),
          `rpc:${dependency}:${pattern}`,
        ),
      ),
    );
  }

  private shouldRetry(error: unknown): boolean {
    if (!(error instanceof HttpException)) {
      return true;
    }

    const status = error.getStatus();
    return status === 502 || status === 503 || status === 504;
  }

  private unwrapError(error: unknown): HttpException {
    const text = this.collectErrorText(error).toUpperCase();

    if (
      text.includes('ECONNREFUSED') ||
      text.includes('ECONNRESET') ||
      text.includes('EPIPE') ||
      text.includes('ETIMEDOUT') ||
      text.includes('ENOTFOUND') ||
      text.includes('SOCKET HANG UP') ||
      text.includes('NO ELEMENTS IN SEQUENCE')
    ) {
      return new HttpException(TCP_DOWN_HINT, 502);
    }

    if (text.includes('TIMEOUT')) {
      return new GatewayTimeoutException(
        `Tempo esgotado ao aguardar o microserviço (${this.config.timeout.rpcMs} ms).`,
      );
    }

    if (error instanceof HttpException) {
      return error;
    }

    if (error && typeof error === 'object') {
      return new HttpException(
        this.extractMessage(error),
        this.extractStatusCode(error),
      );
    }

    if (error instanceof Error) {
      return new HttpException(error.message, 502);
    }

    return new HttpException('Falha na comunicação com o microserviço.', 502);
  }

  private collectErrorText(error: unknown, depth = 0): string {
    if (error == null || depth > 8) {
      return '';
    }
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'number' || typeof error === 'boolean') {
      return String(error);
    }
    if (error instanceof Error) {
      return `${error.name}\n${error.message}\n${error.stack ?? ''}`;
    }
    if (typeof error !== 'object') {
      return String(error);
    }

    return Object.values(error as Record<string, unknown>)
      .map((value) => this.collectErrorText(value, depth + 1))
      .filter(Boolean)
      .join('\n');
  }

  private extractStatusCode(error: object, depth = 0): number {
    if (depth > 8) {
      return 502;
    }

    const record = error as Record<string, unknown>;

    for (const key of ['statusCode', 'status']) {
      const value = Number(record[key]);
      if (Number.isFinite(value) && value >= 400 && value < 600) {
        return value;
      }
    }

    for (const key of ['response', 'message', 'error', 'err']) {
      const nested = record[key];
      if (nested && typeof nested === 'object') {
        const status = this.extractStatusCode(nested, depth + 1);
        if (status !== 502) {
          return status;
        }
      }
    }

    return 502;
  }

  private extractMessage(error: object, depth = 0): string {
    if (depth > 8) {
      return 'Falha na comunicação com o microserviço.';
    }

    const record = error as Record<string, unknown>;
    const message = record['message'];

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      return message.map(String).join('; ');
    }

    for (const key of ['response', 'error', 'err']) {
      const nested = record[key];
      if (typeof nested === 'string' && nested.trim()) {
        return nested;
      }
      if (nested && typeof nested === 'object') {
        const nestedMessage = this.extractMessage(nested, depth + 1);
        if (nestedMessage !== 'Falha na comunicação com o microserviço.') {
          return nestedMessage;
        }
      }
    }

    return 'Falha na comunicação com o microserviço.';
  }
}
