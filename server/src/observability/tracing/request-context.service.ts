import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes, randomUUID } from 'node:crypto';
import { RequestContextStore } from './request-context.types';

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run<T>(context: RequestContextStore, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  get(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  getRequestId(): string | undefined {
    return this.get()?.requestId;
  }

  createFromHeaders(headers: Record<string, unknown>): RequestContextStore {
    const requestId = this.readHeader(
      headers,
      'x-request-id',
      this.readHeader(headers, 'x-correlation-id', randomUUID()),
    );

    return {
      requestId,
      correlationId: this.readHeader(headers, 'x-correlation-id', requestId),
      traceId: this.readHeader(headers, 'x-trace-id', this.generateTraceId()),
      spanId: this.readHeader(headers, 'x-span-id', this.generateSpanId()),
    };
  }

  private readHeader(
    headers: Record<string, unknown>,
    name: string,
    fallback: string,
  ): string {
    const value = headers[name];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (
      Array.isArray(value) &&
      typeof value[0] === 'string' &&
      value[0].trim()
    ) {
      return value[0];
    }
    return fallback;
  }

  private generateTraceId(): string {
    return randomBytes(16).toString('hex');
  }

  private generateSpanId(): string {
    return randomBytes(8).toString('hex');
  }
}
