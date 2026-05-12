import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AulaMicroserviceModule } from '../modules/aula/aula.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AulaMicroserviceModule,
  ],
})
export class AulasMsAppModule {}
