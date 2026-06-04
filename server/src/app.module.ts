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
import { AlunosGatewayModule } from './gateway/alunos.gateway.module';
import { ProfessoresGatewayModule } from './gateway/professores.gateway.module';
import { AlunosTurmaGatewayModule } from './gateway/alunos-turma.gateway.module';
import { InscricoesProfessorGatewayModule } from './gateway/inscricoes-professor.gateway.module';
import { CacheConfigurationModule } from './shared/cache/cache.module';
import { ObservabilityModule } from './observability/observability.module';
import { HealthModule } from './observability/health/health.module';
import { ResilienceModule } from './resilience/resilience.module';
import { VersionModule } from './modules/version/version.module';
import { RealtimeModule } from './realtime/realtime.module';
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
        REDIS_URL: Joi.string().uri().optional(),
        REDIS_USERNAME: Joi.string().allow('', null),
        REDIS_PASSWORD: Joi.string().allow('', null),
        WS_CORS_ORIGIN: Joi.string().default('*'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        BUILD_DATE: Joi.string().isoDate().optional(),
        PORT: Joi.number().default(3000),
        LOG_LEVEL: Joi.string()
          .valid('trace', 'debug', 'info', 'warn', 'error', 'fatal')
          .default('debug'),
        SERVICE_NAME: Joi.string().default('gestor-academico-gateway'),
        RABBITMQ_URL: Joi.string()
          .uri()
          .default('amqp://gestor:gestor@127.0.0.1:5672'),
        METRICS_DEFAULT_PREFIX: Joi.string().default('gestor_academico_'),
        EXTERNAL_SERVICES: Joi.string().allow('').default(''),
        HEALTHCHECK_EXTERNAL_TIMEOUT_MS: Joi.number().default(2000),
        RESILIENCE_RETRY_ATTEMPTS: Joi.number().min(1).default(3),
        RESILIENCE_RETRY_INITIAL_DELAY_MS: Joi.number().min(0).default(200),
        RESILIENCE_RETRY_MAX_DELAY_MS: Joi.number().min(0).default(3000),
        RESILIENCE_TIMEOUT_MS: Joi.number().min(1).default(2500),
        RESILIENCE_RPC_TIMEOUT_MS: Joi.number().min(1).default(10000),
        RESILIENCE_EXTERNAL_HTTP_TIMEOUT_MS: Joi.number().min(1).default(5000),
        RESILIENCE_CIRCUIT_BREAKER_THRESHOLD: Joi.number().min(1).default(5),
        RESILIENCE_CIRCUIT_BREAKER_HALF_OPEN_AFTER_MS: Joi.number()
          .min(1)
          .default(15000),
        RESILIENCE_CIRCUIT_BREAKER_TIMEOUT_MS: Joi.number()
          .min(1)
          .default(12000),
        RESILIENCE_BULKHEAD_LIMIT: Joi.number().min(1).default(50),
        RESILIENCE_BULKHEAD_QUEUE_LIMIT: Joi.number().min(0).default(100),
      }),
    }),
    ObservabilityModule,
    HealthModule,
    ResilienceModule,
    CacheConfigurationModule,
    RealtimeModule,
    PrismaModule,
    UsuariosGatewayModule,
    TurmasGatewayModule,
    CursosGatewayModule,
    DisciplinasGatewayModule,
    MatriculasGatewayModule,
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
