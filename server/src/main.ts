import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './shared/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  const configSwagger = new DocumentBuilder()
    .setTitle('Gestão Acadêmica Simplificada')
    .setDescription(
      'Gateway HTTP público da API acadêmica. Usuários, turmas, cursos, ' +
        'disciplinas, matrículas, aulas, alunos e professores são roteados para microserviços por TCP (/users, ' +
        '/turmas, /cursos, /disciplina, /matricula, /aula, /alunos e /professores).',
    )
    .setVersion('1.0')
    .addTag('Usuários')
    .addTag('Cursos')
    .addTag('Disciplinas')
    .addTag('Turmas')
    .addTag('Matrículas')
    .addTag('Aulas')
    .addTag('Alunos')
    .addTag('Professores')
    .addTag('Presenças')
    .addTag('Avaliações')
    .addTag('Notificações')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
