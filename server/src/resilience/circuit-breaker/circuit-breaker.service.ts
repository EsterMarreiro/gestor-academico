import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import CircuitBreaker from 'opossum';
import { PinoLogger } from 'nestjs-pino';
import { MetricsService } from '../../observability/metrics/metrics.service';
import { ResilienceConfigService } from '../resilience.config';

@Injectable()
export class CircuitBreakerService {
  private readonly breakers = new Map<
    string,
    CircuitBreaker<[() => Promise<unknown>], unknown>
  >();

  constructor(
    private readonly config: ResilienceConfigService,
    private readonly metrics: MetricsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CircuitBreakerService.name);
  }

  async execute<T>(
    dependency: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const breaker = this.getBreaker(dependency);
    return breaker.fire(operation) as Promise<T>;
  }

  private getBreaker(
    dependency: string,
  ): CircuitBreaker<[() => Promise<unknown>], unknown> {
    const existing = this.breakers.get(dependency);
    if (existing) {
      return existing;
    }

    const breaker = new CircuitBreaker(
      (operation: () => Promise<unknown>) => {
        return operation();
      },
      {
        timeout: this.config.circuitBreaker.timeoutMs,
        resetTimeout: this.config.circuitBreaker.resetTimeoutMs,
        errorThresholdPercentage: 100,
        volumeThreshold: this.config.circuitBreaker.volumeThreshold,
      },
    );

    breaker.fallback(() => {
      throw new ServiceUnavailableException(
        `Circuit breaker aberto para ${dependency}.`,
      );
    });

    breaker.on('open', () => {
      this.metrics.setCircuitBreakerState(dependency, 'open');
      this.logger.warn({ dependency }, 'Circuit breaker opened');
    });

    breaker.on('halfOpen', () => {
      this.metrics.setCircuitBreakerState(dependency, 'halfOpen');
      this.logger.warn({ dependency }, 'Circuit breaker half-open');
    });

    breaker.on('close', () => {
      this.metrics.setCircuitBreakerState(dependency, 'closed');
      this.logger.info({ dependency }, 'Circuit breaker closed');
    });

    this.metrics.setCircuitBreakerState(dependency, 'closed');
    this.breakers.set(dependency, breaker);
    return breaker;
  }
}
