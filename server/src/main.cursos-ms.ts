import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CursosMsAppModule } from './microservice-apps/cursos-ms-app.module';

async function bootstrap() {
  const port = parseInt(process.env.CURSOS_MS_PORT ?? '4003', 10);
  const host = process.env.CURSOS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(CursosMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();

  Logger.log(
    `Microserviço de cursos TCP escutando em ${host}:${port}`,
    'CursosMS',
  );
}

void bootstrap();
