import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AlunoTurmaMicroserviceModule } from '../modules/aluno-turma/aluno-turma.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AlunoTurmaMicroserviceModule,
  ],
})
export class AlunosTurmaMsAppModule {}
