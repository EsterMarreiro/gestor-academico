import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosGatewayController } from './usuarios.gateway.controller';
import { USERS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USERS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('USERS_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('USERS_MS_PORT', '4001'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsuariosGatewayController],
})
export class UsuariosGatewayModule {}
