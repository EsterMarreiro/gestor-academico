import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { DisciplinaMicroserviceModule } from '../modules/disciplina/disciplina.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DisciplinaMicroserviceModule,
  ],
})
export class DisciplinasMsAppModule {}
