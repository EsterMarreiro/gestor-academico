import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { connect } from 'amqplib';

@Injectable()
export class RabbitMqHealthIndicator {
  constructor(private readonly config: ConfigService) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const connection = await connect(
        this.config.get('RABBITMQ_URL', 'amqp://gestor:gestor@127.0.0.1:5672'),
      );
      await connection.close();

      return {
        [key]: {
          status: 'up',
        },
      };
    } catch (error) {
      throw new HealthCheckError('RabbitMQ check failed', {
        [key]: {
          status: 'down',
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
}
