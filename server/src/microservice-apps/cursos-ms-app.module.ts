import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CursosMicroserviceModule } from '../modules/cursos/cursos.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CursosMicroserviceModule,
  ],
})
export class CursosMsAppModule {}
