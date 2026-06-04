import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { PinoLogger } from 'nestjs-pino';
import { MetricsService } from '../observability/metrics/metrics.service';
import { BulkheadService } from './bulkhead/bulkhead.service';
import { CircuitBreakerService } from './circuit-breaker/circuit-breaker.service';
import { ResilienceConfigService } from './resilience.config';
import { RetryService } from './retry/retry.service';

@Injectable()
export class ResilientHttpService {
  private readonly client = axios.create();

  constructor(
    private readonly metrics: MetricsService,
    private readonly bulkhead: BulkheadService,
    private readonly breaker: CircuitBreakerService,
    private readonly retry: RetryService,
    private readonly config: ResilienceConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ResilientHttpService.name);

    axiosRetry(this.client, {
      retries: this.config.retry.attempts - 1,
      retryCondition: (error) => this.shouldRetry(error),
      retryDelay: (retryCount) =>
        Math.min(
          this.config.retry.initialDelayMs * 2 ** (retryCount - 1),
          this.config.retry.maxDelayMs,
        ),
    });
  }

  async request<T>(
    config: AxiosRequestConfig,
    dependency = this.resolveDependency(config.url),
  ): Promise<T> {
    const method = (config.method ?? 'GET').toUpperCase();
    const target = this.resolveTarget(config.url);

    return this.bulkhead.run(dependency, () =>
      this.breaker.execute(dependency, () =>
        this.retry.execute(
          async () => {
            const startedAt = process.hrtime.bigint();
            try {
              const response = await this.client.request<T>({
                timeout: this.config.timeout.externalHttpMs,
                ...config,
              });

              this.metrics.recordExternalHttpCall(
                dependency,
                method,
                target,
                response.status,
                Number(process.hrtime.bigint() - startedAt) / 1_000_000,
                'success',
              );

              return response.data;
            } catch (error) {
              const statusCode = this.resolveStatusCode(error);
              this.metrics.recordExternalHttpCall(
                dependency,
                method,
                target,
                statusCode,
                Number(process.hrtime.bigint() - startedAt) / 1_000_000,
                'error',
              );
              throw error;
            }
          },
          (error) => this.shouldRetry(error),
          `${method} ${target}`,
        ),
      ),
    );
  }

  private shouldRetry(error: unknown): boolean {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    return !status || status >= 500 || axiosError.code === 'ECONNABORTED';
  }

  private resolveDependency(url?: string): string {
    if (!url) {
      return 'external-http';
    }

    try {
      return new URL(url).hostname;
    } catch {
      return 'external-http';
    }
  }

  private resolveTarget(url?: string): string {
    if (!url) {
      return 'unknown';
    }

    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`;
    } catch {
      return url;
    }
  }

  private resolveStatusCode(error: unknown): number {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status) {
      return axiosError.response.status;
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 504;
    }

    if (axiosError.code) {
      return 503;
    }

    return new ServiceUnavailableException().getStatus();
  }
}
