import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios.module';
import { UsuariosTcpController } from './usuarios.tcp.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [UsuariosTcpController],
})
export class UsuariosMicroserviceModule {}
