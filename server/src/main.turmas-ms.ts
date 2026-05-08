import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TurmasMsAppModule } from './microservice-apps/turmas-ms-app.module';

async function bootstrap() {
  const port = parseInt(process.env.TURMAS_MS_PORT ?? '4002', 10);
  const host = process.env.TURMAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(TurmasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();

  Logger.log(
    `Microserviço de turmas TCP escutando em ${host}:${port}`,
    'TurmasMS',
  );
}

void bootstrap();
