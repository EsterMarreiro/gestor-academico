import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class ApplicationHealthIndicator {
  isHealthy(): HealthIndicatorResult {
    return {
      application: {
        status: 'up',
      },
    };
  }
}
