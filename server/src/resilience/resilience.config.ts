import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface RetryOptions {
  attempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
}

export interface TimeoutOptions {
  defaultMs: number;
  rpcMs: number;
  externalHttpMs: number;
}

export interface CircuitBreakerOptions {
  volumeThreshold: number;
  resetTimeoutMs: number;
  timeoutMs: number;
}

export interface BulkheadOptions {
  maxConcurrent: number;
  maxQueue: number;
}

@Injectable()
export class ResilienceConfigService {
  constructor(private readonly config: ConfigService) {}

  get retry(): RetryOptions {
    return {
      attempts: this.config.get<number>('RESILIENCE_RETRY_ATTEMPTS', 3),
      initialDelayMs: this.config.get<number>(
        'RESILIENCE_RETRY_INITIAL_DELAY_MS',
        200,
      ),
      maxDelayMs: this.config.get<number>(
        'RESILIENCE_RETRY_MAX_DELAY_MS',
        3000,
      ),
    };
  }

  get timeout(): TimeoutOptions {
    return {
      defaultMs: this.config.get<number>('RESILIENCE_TIMEOUT_MS', 2500),
      rpcMs: this.config.get<number>('RESILIENCE_RPC_TIMEOUT_MS', 10_000),
      externalHttpMs: this.config.get<number>(
        'RESILIENCE_EXTERNAL_HTTP_TIMEOUT_MS',
        5000,
      ),
    };
  }

  get circuitBreaker(): CircuitBreakerOptions {
    return {
      volumeThreshold: this.config.get<number>(
        'RESILIENCE_CIRCUIT_BREAKER_THRESHOLD',
        5,
      ),
      resetTimeoutMs: this.config.get<number>(
        'RESILIENCE_CIRCUIT_BREAKER_HALF_OPEN_AFTER_MS',
        15_000,
      ),
      timeoutMs: this.config.get<number>(
        'RESILIENCE_CIRCUIT_BREAKER_TIMEOUT_MS',
        12_000,
      ),
    };
  }

  get bulkhead(): BulkheadOptions {
    return {
      maxConcurrent: this.config.get<number>('RESILIENCE_BULKHEAD_LIMIT', 50),
      maxQueue: this.config.get<number>('RESILIENCE_BULKHEAD_QUEUE_LIMIT', 100),
    };
  }
}
