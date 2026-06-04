import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CursosGatewayController } from './cursos.gateway.controller';
import { CURSOS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CURSOS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('CURSOS_MS_HOST', '127.0.0.1'),
            port: parseInt(config.get<string>('CURSOS_MS_PORT', '4003'), 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CursosGatewayController],
})
export class CursosGatewayModule {}
