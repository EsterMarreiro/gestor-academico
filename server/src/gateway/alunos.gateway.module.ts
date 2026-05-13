import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlunosGatewayController } from './alunos.gateway.controller';
import { ALUNOS_SERVICE_TOKEN } from './gateway-tokens';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ALUNOS_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('ALUNOS_MS_HOST', '127.0.0.1'),
            port: parseInt(
              config.get<string>('ALUNOS_MS_PORT', '4007'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AlunosGatewayController],
})
export class AlunosGatewayModule {}
