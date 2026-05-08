import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { TurmasMicroserviceModule } from '../modules/turmas/turmas.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TurmasMicroserviceModule,
  ],
})
export class TurmasMsAppModule {}
