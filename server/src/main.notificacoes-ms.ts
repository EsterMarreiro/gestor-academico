import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';
import { NotificacoesAppModule } from './microservice-apps/notificacoes-app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    NotificacoesAppModule,
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(PinoLogger));
  app.enableShutdownHooks();

  Logger.log(
    'Serviço de notificações iniciado e aguardando MatriculaCriadaEvent',
    'NotificacoesMS',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    undefined,
    'NotificacoesMS',
  );
  process.exitCode = 1;
});
