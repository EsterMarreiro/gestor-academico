import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MatriculasMsAppModule } from './microservice-apps/matriculas-ms-app.module';

async function bootstrap() {
  const port = parseInt(process.env.MATRICULAS_MS_PORT ?? '4005', 10);
  const host = process.env.MATRICULAS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(MatriculasMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();

  Logger.log(
    `Microserviço de matrículas TCP escutando em ${host}:${port}`,
    'MatriculasMS',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
    undefined,
    'MatriculasMS',
  );
  process.exitCode = 1;
});
