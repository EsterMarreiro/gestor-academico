import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '../observability/observability.module';
import { ResilienceModule } from '../resilience/resilience.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { UsuariosMicroserviceModule } from '../modules/usuarios/usuarios.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    ResilienceModule,
    PrismaModule,
    UsuariosMicroserviceModule,
  ],
})
export class UsuariosMsAppModule {}
