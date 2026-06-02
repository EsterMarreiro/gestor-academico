import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AlunosTurmaMsAppModule } from './microservice-apps/alunos-turma-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.ALUNOS_TURMA_MS_PORT ?? '4009', 10);
  const host = process.env.ALUNOS_TURMA_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(AlunosTurmaMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen();

  Logger.log(
    `Microserviço de alunos-turma TCP escutando em ${host}:${port}`,
    'AlunosTurmaMS',
  );
}

void bootstrap();
