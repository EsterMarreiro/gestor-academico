import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CursosMsAppModule } from './microservice-apps/cursos-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.CURSOS_MS_PORT ?? '4003', 10);
  const host = process.env.CURSOS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(CursosMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();

  Logger.log(
    `Microserviço de cursos TCP escutando em ${host}:${port}`,
    'CursosMS',
  );
}

void bootstrap();
