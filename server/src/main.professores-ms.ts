import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ProfessoresMsAppModule } from './microservice-apps/professores-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.PROFESSORES_MS_PORT ?? '4008', 10);
  const host = process.env.PROFESSORES_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(ProfessoresMsAppModule, {
    bufferLogs: true,
    transport: Transport.TCP,
    options: { host, port },
  });
  app.useLogger(app.get(PinoLogger));
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
    `Microserviço de professores TCP escutando em ${host}:${port}`,
    'ProfessoresMS',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    undefined,
    'ProfessoresMS',
  );
  process.exitCode = 1;
});
