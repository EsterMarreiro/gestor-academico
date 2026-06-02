import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { InscricaoProfessorMicroserviceModule } from '../modules/inscricao-professor/inscricao-professor.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    InscricaoProfessorMicroserviceModule,
  ],
})
export class InscricoesProfessorMsAppModule {}
