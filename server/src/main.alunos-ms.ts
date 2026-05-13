import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AlunosMsAppModule } from './microservice-apps/alunos-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.ALUNOS_MS_PORT ?? '4007', 10);
  const host = process.env.ALUNOS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(AlunosMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen();

  Logger.log(
    `Microserviço de alunos TCP escutando em ${host}:${port}`,
    'AlunosMS',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
    undefined,
    'AlunosMS',
  );
  process.exitCode = 1;
});
