import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AlunoMicroserviceModule } from '../modules/aluno/aluno.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AlunoMicroserviceModule,
  ],
})
export class AlunosMsAppModule {}
