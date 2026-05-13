import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { ProfessorMicroserviceModule } from '../modules/professor/professor.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProfessorMicroserviceModule,
  ],
})
export class ProfessoresMsAppModule {}
