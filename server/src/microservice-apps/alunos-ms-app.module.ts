import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '../observability/observability.module';
import { ResilienceModule } from '../resilience/resilience.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AlunoMicroserviceModule } from '../modules/aluno/aluno.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    ResilienceModule,
    PrismaModule,
    AlunoMicroserviceModule,
  ],
})
export class AlunosMsAppModule {}
