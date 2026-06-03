import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  MATRICULA_ATUALIZADA_EVENT,
  MATRICULA_CRIADA_EVENT,
  MATRICULA_REMOVIDA_EVENT,
} from '../contracts/rmq.events';
import {
  RMQ_EVENTS_EXCHANGE,
  RMQ_EVENTS_EXCHANGE_TYPE,
} from '../messaging/rmq.constants';
import {
  RabbitMqConnectionService,
  RabbitMqSubscriptionOptions,
} from '../messaging/rabbitmq-connection.service';
import { GatewayCacheService } from '../shared/cache/gateway-cache.service';
import { RealtimeEventsGateway } from './realtime-events.gateway';

type MatriculaEventPayload = {
  matriculaId: number;
  alunoId?: number;
  cursoId?: number;
  status?: string;
};

const MATRICULAS_LIST_CACHE_KEY = 'gateway:matriculas:list';

@Injectable()
export class MatriculaRealtimeConsumer implements OnModuleInit {
  private readonly logger = new Logger(MatriculaRealtimeConsumer.name);

  constructor(
    private readonly rabbitMq: RabbitMqConnectionService,
    private readonly cache: GatewayCacheService,
    private readonly realtimeGateway: RealtimeEventsGateway,
  ) {}

  async onModuleInit() {
    const subscription: RabbitMqSubscriptionOptions<MatriculaEventPayload> = {
      exchange: RMQ_EVENTS_EXCHANGE,
      exchangeType: RMQ_EVENTS_EXCHANGE_TYPE,
      queue: 'gestor_academico.gateway.realtime',
      routingKeys: [
        MATRICULA_CRIADA_EVENT,
        MATRICULA_ATUALIZADA_EVENT,
        MATRICULA_REMOVIDA_EVENT,
      ],
      consumerTag: 'gateway-realtime-matriculas',
      onMessage: async (event, meta) => {
        const matriculaId = event.matriculaId;
        await this.cache.deleteMany([
          MATRICULAS_LIST_CACHE_KEY,
          `gateway:matriculas:item:${matriculaId}`,
        ]);
        this.realtimeGateway.emit(meta.routingKey, event);
      },
    };

    await this.rabbitMq.subscribe(subscription);

    this.logger.log(
      `Consumidor realtime inscrito em ${subscription.queue} para ${subscription.routingKeys.join(', ')}`,
    );
  }
}
