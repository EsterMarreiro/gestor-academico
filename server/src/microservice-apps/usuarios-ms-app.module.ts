import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { UsuariosMicroserviceModule } from '../modules/usuarios/usuarios.microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuariosMicroserviceModule,
  ],
})
export class UsuariosMsAppModule {}
