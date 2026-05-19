import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AulasMsAppModule } from './microservice-apps/aulas-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.AULAS_MS_PORT ?? '4006', 10);
  const host = process.env.AULAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(AulasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();

  Logger.log(
    `Microserviço de aulas TCP escutando em ${host}:${port}`,
    'AulasMS',
  );
}

bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    undefined,
    'AulasMS',
  );
  process.exitCode = 1;
});
