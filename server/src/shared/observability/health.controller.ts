import { Controller, Get } from '@nestjs/common';

type HealthStatus = 'ok' | 'ready';

interface HealthResponse {
  service: string;
  status: HealthStatus;
  uptimeSeconds: number;
  timestamp: string;
}

@Controller()
export class HealthController {
  private readonly serviceName = 'gestor-academico-gateway';

  @Get('health')
  getHealth(): HealthResponse {
    return this.buildResponse('ok');
  }

  @Get('ready')
  getReady(): HealthResponse {
    return this.buildResponse('ready');
  }

  private buildResponse(status: HealthStatus): HealthResponse {
    return {
      service: this.serviceName,
      status,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
