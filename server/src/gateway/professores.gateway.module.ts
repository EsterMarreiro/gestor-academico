import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfessoresGatewayController } from './professores.gateway.controller';
import { PROFESSORES_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PROFESSORES_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('PROFESSORES_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('PROFESSORES_MS_PORT', '4008'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProfessoresGatewayController],
})
export class ProfessoresGatewayModule {}
