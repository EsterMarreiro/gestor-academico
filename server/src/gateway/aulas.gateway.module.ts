import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AulasGatewayController } from './aulas.gateway.controller';
import { AULAS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AULAS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('AULAS_MS_HOST', '127.0.0.1'),
            port: parseInt(config.get<string>('AULAS_MS_PORT', '4006'), 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AulasGatewayController],
})
export class AulasGatewayModule {}
