import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { MetricsModule } from '../metrics/metrics.module';
import { HealthController } from './health.controller';
import { ObservabilityHealthService } from './health.service';
import { ApplicationHealthIndicator } from './indicators/application-health.indicator';
import { PrismaHealthIndicator } from './indicators/prisma-health.indicator';
import { RabbitMqHealthIndicator } from './indicators/rabbitmq-health.indicator';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';

@Module({
  imports: [TerminusModule, HttpModule, MetricsModule],
  controllers: [HealthController],
  providers: [
    ObservabilityHealthService,
    ApplicationHealthIndicator,
    PrismaHealthIndicator,
    RedisHealthIndicator,
    RabbitMqHealthIndicator,
  ],
})
export class HealthModule {}
