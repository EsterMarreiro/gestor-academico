import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DisciplinasMsAppModule } from './microservice-apps/disciplinas-ms-app.module';

async function bootstrap() {
  const port = parseInt(process.env.DISCIPLINAS_MS_PORT ?? '4004', 10);
  const host = process.env.DISCIPLINAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(DisciplinasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();

  Logger.log(
    `Microserviço de disciplinas TCP escutando em ${host}:${port}`,
    'DisciplinasMS',
  );
}

void bootstrap();
