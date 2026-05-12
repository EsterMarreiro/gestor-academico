import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DisciplinasGatewayController } from './disciplinas.gateway.controller';
import { DISCIPLINAS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: DISCIPLINAS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('DISCIPLINAS_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('DISCIPLINAS_MS_PORT', '4004'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DisciplinasGatewayController],
})
export class DisciplinasGatewayModule {}
