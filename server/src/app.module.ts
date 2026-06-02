import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsuariosGatewayModule } from './gateway/usuarios.gateway.module';
import { TurmasGatewayModule } from './gateway/turmas.gateway.module';
import { CursosGatewayModule } from './gateway/cursos.gateway.module';
import { DisciplinasGatewayModule } from './gateway/disciplinas.gateway.module';
import { MatriculasGatewayModule } from './gateway/matriculas.gateway.module';
import { AulasGatewayModule } from './gateway/aulas.gateway.module';
import { AlunosGatewayModule } from './gateway/alunos.gateway.module';
import { ProfessoresGatewayModule } from './gateway/professores.gateway.module';
import { AlunosTurmaGatewayModule } from './gateway/alunos-turma.gateway.module';
import { InscricoesProfessorGatewayModule } from './gateway/inscricoes-professor.gateway.module';
import { CacheConfigurationModule } from './shared/cache/cache.module';
import { ObservabilityModule } from './shared/observability/observability.module';
import { VersionModule } from './modules/version/version.module';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string()
          .uri()
          .default(
            'postgresql://postgres:postgres@localhost:5432/gestor_academico?schema=public',
          ),
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_USERNAME: Joi.string().allow('', null),
        REDIS_PASSWORD: Joi.string().allow('', null),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        BUILD_DATE: Joi.string().isoDate().optional(),
        PORT: Joi.number().default(3000),
      }),
    }),
    ObservabilityModule,
    CacheConfigurationModule,
    PrismaModule,
    UsuariosGatewayModule,
    TurmasGatewayModule,
    CursosGatewayModule,
    DisciplinasGatewayModule,
    MatriculasGatewayModule,
    AulasGatewayModule,
    AlunosGatewayModule,
    ProfessoresGatewayModule,
    AlunosTurmaGatewayModule,
    InscricoesProfessorGatewayModule,
    VersionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
