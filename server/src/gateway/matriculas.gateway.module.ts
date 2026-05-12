import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatriculasGatewayController } from './matriculas.gateway.controller';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MATRICULAS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('MATRICULAS_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('MATRICULAS_MS_PORT', '4005'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MatriculasGatewayController],
})
export class MatriculasGatewayModule {}
