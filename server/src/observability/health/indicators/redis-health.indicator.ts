import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisHealthIndicator {
  private client?: RedisClientType;

  constructor(private readonly config: ConfigService) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const client = await this.getClient();
      await client.ping();
      return {
        [key]: {
          status: 'up',
        },
      };
    } catch (error) {
      throw new HealthCheckError('Redis check failed', {
        [key]: {
          status: 'down',
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  private async getClient(): Promise<RedisClientType> {
    if (!this.client) {
      const redisUrl =
        this.config.get<string>('REDIS_URL') ||
        `redis://${this.config.get('REDIS_HOST', '127.0.0.1')}:${this.config.get('REDIS_PORT', 6379)}`;

      this.client = createClient({
        url: redisUrl,
        password: this.config.get<string>('REDIS_PASSWORD') || undefined,
        username: this.config.get<string>('REDIS_USERNAME') || undefined,
      });

      await this.client.connect();
    }

    return this.client;
  }
}
