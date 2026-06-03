import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  MATRICULA_CRIADA_EVENT,
  MatriculaCriadaPayload,
} from '../contracts/rmq.events';
import {
  RMQ_EVENTS_EXCHANGE,
  RMQ_EVENTS_EXCHANGE_TYPE,
  RMQ_QUEUE_NOTIFICACOES,
} from '../messaging/rmq.constants';
import {
  RabbitMqConnectionService,
  RabbitMqSubscriptionOptions,
} from '../messaging/rabbitmq-connection.service';
import { NotificacoesService } from './notificacoes.service';

@Injectable()
export class MatriculaCriadaConsumer implements OnModuleInit {
  private readonly logger = new Logger(MatriculaCriadaConsumer.name);

  constructor(
    private readonly rabbitMq: RabbitMqConnectionService,
    private readonly notificacoes: NotificacoesService,
  ) {}

  async onModuleInit() {
    const subscription: RabbitMqSubscriptionOptions<MatriculaCriadaPayload> = {
      exchange: RMQ_EVENTS_EXCHANGE,
      exchangeType: RMQ_EVENTS_EXCHANGE_TYPE,
      queue: RMQ_QUEUE_NOTIFICACOES,
      routingKeys: [MATRICULA_CRIADA_EVENT],
      consumerTag: 'notificacoes-matricula-criada',
      onMessage: async (event) => {
        this.notificacoes.simularEmailMatriculaCriada(event);
      },
    };

    await this.rabbitMq.subscribe(subscription);

    this.logger.log(
      `Consumidor de notificações inscrito em ${subscription.queue} para ${subscription.routingKeys.join(', ')}`,
    );
  }
}
