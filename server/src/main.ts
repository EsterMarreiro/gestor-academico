import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './shared/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Gestão Acadêmica Simplificada')
    .setDescription(
      'Gateway HTTP público da API acadêmica. Usuários, turmas, cursos, ' +
        'disciplinas, matrículas, alunos, professores, vínculos aluno-turma e inscrições de professor ' +
        'são expostos por REST e roteados para microserviços TCP.',
    )
    .setVersion('1.0')
    .addTag('Usuários')
    .addTag('Cursos')
    .addTag('Disciplinas')
    .addTag('Turmas')
    .addTag('Matrículas')
    .addTag('Alunos')
    .addTag('Professores')
    .addTag('AlunoTurma')
    .addTag('InscricoesProfessor')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
