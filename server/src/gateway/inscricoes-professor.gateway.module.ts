import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { INSCRICOES_PROFESSOR_SERVICE_TOKEN } from './gateway-tokens';
import { InscricoesProfessorGatewayController } from './inscricoes-professor.gateway.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: INSCRICOES_PROFESSOR_SERVICE_TOKEN,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>(
              'INSCRICOES_PROFESSOR_MS_HOST',
              '127.0.0.1',
            ),
            port: parseInt(
              config.get<string>('INSCRICOES_PROFESSOR_MS_PORT', '4010'),
              10,
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InscricoesProfessorGatewayController],
})
export class InscricoesProfessorGatewayModule {}
