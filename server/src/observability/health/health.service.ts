import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorFunction,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { MetricsService } from '../metrics/metrics.service';
import { ApplicationHealthIndicator } from './indicators/application-health.indicator';
import { PrismaHealthIndicator } from './indicators/prisma-health.indicator';
import { RabbitMqHealthIndicator } from './indicators/rabbitmq-health.indicator';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';

@Injectable()
export class ObservabilityHealthService
  implements OnModuleInit, OnModuleDestroy
{
  private probeTimer?: ReturnType<typeof setInterval>;

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly config: ConfigService,
    private readonly metrics: MetricsService,
    private readonly applicationIndicator: ApplicationHealthIndicator,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly rabbitMqIndicator: RabbitMqHealthIndicator,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const result = await this.health.check([
      async () => this.applicationIndicator.isHealthy(),
      async () => this.prismaIndicator.isHealthy('database'),
      async () => this.redisIndicator.isHealthy('redis'),
      async () => this.rabbitMqIndicator.isHealthy('rabbitmq'),
      ...this.getExternalChecks(),
    ]);

    this.updateMetrics(result);
    return result;
  }

  async onModuleInit(): Promise<void> {
    await this.runProbe();
    this.probeTimer = setInterval(() => {
      void this.runProbe();
    }, 30_000);
  }

  onModuleDestroy(): void {
    if (this.probeTimer) {
      clearInterval(this.probeTimer);
    }
  }

  private getExternalChecks(): HealthIndicatorFunction[] {
    const configured = this.config.get<string>('EXTERNAL_SERVICES', '');
    const timeout = this.config.get<number>(
      'HEALTHCHECK_EXTERNAL_TIMEOUT_MS',
      2000,
    );

    return configured
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, url] = entry.split('|').map((value) => value.trim());

        return async (): Promise<HealthIndicatorResult> =>
          this.http.pingCheck(name, url, {
            timeout,
          });
      });
  }

  private async runProbe(): Promise<void> {
    try {
      const result = await this.check();
      this.updateMetrics(result);
    } catch (error) {
      const result = error as Partial<HealthCheckResult> & {
        causes?: Record<string, { status?: string }>;
      };

      if (result.causes) {
        for (const [name, details] of Object.entries(result.causes)) {
          this.metrics.setHealthStatus(name, details.status === 'up');
        }
      }
    }
  }

  private updateMetrics(result: HealthCheckResult): void {
    for (const [name, details] of Object.entries(result.details)) {
      const status =
        typeof details === 'object' &&
        details !== null &&
        'status' in details &&
        details.status === 'up';

      this.metrics.setHealthStatus(name, status);
    }
  }
}
