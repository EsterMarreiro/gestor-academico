import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UsuariosMsAppModule } from './microservice-apps/usuarios-ms-app.module';

async function bootstrap() {
  const port = parseInt(process.env.USERS_MS_PORT ?? '4001', 10);
  const host = process.env.USERS_MS_BIND ?? '0.0.0.0';
  const app = await NestFactory.createMicroservice(UsuariosMsAppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });
  await app.listen();

  Logger.log(
    `Microserviço de usuários TCP escutando em ${host}:${port}`,
    'UsuariosMS',
  );
}

void bootstrap();
