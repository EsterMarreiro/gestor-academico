import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { ObservabilityHealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly observabilityHealthService: ObservabilityHealthService,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.observabilityHealthService.check();
  }
}
