import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MatriculasMsAppModule } from './microservice-apps/matriculas-ms-app.module';
import { HttpToRpcExceptionFilter } from './shared/filters/http-to-rpc-exception.filter';

async function bootstrap() {
  const port = parseInt(process.env.MATRICULAS_MS_PORT ?? '4005', 10);
  const host = process.env.MATRICULAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(MatriculasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();

  Logger.log(
    `Microserviço de matrículas TCP escutando em ${host}:${port}`,
    'MatriculasMS',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    undefined,
    'MatriculasMS',
  );
  process.exitCode = 1;
});
