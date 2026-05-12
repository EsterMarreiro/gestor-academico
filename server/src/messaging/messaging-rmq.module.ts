import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DomainEventsPublisher } from './domain-events.publisher';
import { MatriculaEventsPublisher } from './matricula-events.publisher';
import { UsuarioEventsPublisher } from './usuario-events.publisher';
import {
  RMQ_CLIENT_MATRICULA_EVENTS,
  RMQ_QUEUE_MATRICULAS_EVENTS,
} from './rmq.constants';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: RMQ_CLIENT_MATRICULA_EVENTS,
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [
                config.get<string>(
                  'RABBITMQ_URL',
                  'amqp://gestor:gestor@127.0.0.1:5672',
                ),
              ],
              queue: RMQ_QUEUE_MATRICULAS_EVENTS,
              queueOptions: {
                durable: true,
              },
              socketOptions: {
                heartbeatIntervalInSeconds: 60,
                reconnectTimeInSeconds: 5,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
  ],
  providers: [
    MatriculaEventsPublisher,
    UsuarioEventsPublisher,
    DomainEventsPublisher,
  ],
  exports: [
    MatriculaEventsPublisher,
    UsuarioEventsPublisher,
    DomainEventsPublisher,
  ],
})
export class MessagingRmqModule {}
