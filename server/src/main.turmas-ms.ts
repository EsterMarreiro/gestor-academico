import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TurmasMsAppModule } from './microservice-apps/turmas-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.TURMAS_MS_PORT ?? '4002', 10);
  const host = process.env.TURMAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(TurmasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();

  Logger.log(
    `Microserviço de turmas TCP escutando em ${host}:${port}`,
    'TurmasMS',
  );
}

void bootstrap();
