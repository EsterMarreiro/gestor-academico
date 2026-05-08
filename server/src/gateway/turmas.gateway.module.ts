import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TurmasGatewayController } from './turmas.gateway.controller';
import { TURMAS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TURMAS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('TURMAS_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('TURMAS_MS_PORT', '4002'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TurmasGatewayController],
})
export class TurmasGatewayModule {}
