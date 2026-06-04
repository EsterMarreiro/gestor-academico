import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '../observability/observability.module';
import { ResilienceModule } from '../resilience/resilience.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { InscricaoProfessorMicroserviceModule } from '../modules/inscricao-professor/inscricao-professor.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    ResilienceModule,
    PrismaModule,
    InscricaoProfessorMicroserviceModule,
  ],
})
export class InscricoesProfessorMsAppModule {}
