import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('Gestão Acadêmica Simplificada')
    .setDescription(
      'Gateway HTTP público da API acadêmica. Usuários e turmas são roteados ' +
      'para microserviços por TCP (/users e /turmas).',
    )
    .setVersion('1.0')
    .addTag('Usuários')
    .addTag('Cursos')
    .addTag('Disciplinas')
    .addTag('Turmas')
    .addTag('Matrículas')
    .addTag('Aulas')
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
bootstrap();
