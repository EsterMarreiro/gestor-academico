import { Test, TestingModule } from '@nestjs/testing';
import {
  MATRICULA_ATUALIZADA_EVENT,
  MATRICULA_CRIADA_EVENT,
  MATRICULA_REMOVIDA_EVENT,
} from '../contracts/rmq.events';
import {
  RabbitMqConnectionService,
  RabbitMqSubscriptionOptions,
} from '../messaging/rabbitmq-connection.service';
import { GatewayCacheService } from '../shared/cache/gateway-cache.service';
import { MatriculaRealtimeConsumer } from './matricula-realtime.consumer';
import { RealtimeEventsGateway } from './realtime-events.gateway';

describe('MatriculaRealtimeConsumer', () => {
  let consumer: MatriculaRealtimeConsumer;
  let subscribeMock: jest.Mock;
  let deleteManyMock: jest.Mock;
  let emitMock: jest.Mock;

  beforeEach(async () => {
    subscribeMock = jest.fn();
    deleteManyMock = jest.fn().mockResolvedValue(undefined);
    emitMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatriculaRealtimeConsumer,
        {
          provide: RabbitMqConnectionService,
          useValue: { subscribe: subscribeMock },
        },
        {
          provide: GatewayCacheService,
          useValue: { deleteMany: deleteManyMock },
        },
        {
          provide: RealtimeEventsGateway,
          useValue: { emit: emitMock },
        },
      ],
    }).compile();

    consumer = module.get(MatriculaRealtimeConsumer);
  });

  it('subscribes to matrícula events and invalidates cache before broadcasting', async () => {
    await consumer.onModuleInit();

    expect(subscribeMock).toHaveBeenCalledTimes(1);

    const subscription = subscribeMock.mock
      .calls[0][0] as RabbitMqSubscriptionOptions<{
      matriculaId: number;
    }>;

    expect(subscription.routingKeys).toEqual([
      MATRICULA_CRIADA_EVENT,
      MATRICULA_ATUALIZADA_EVENT,
      MATRICULA_REMOVIDA_EVENT,
    ]);

    await subscription.onMessage(
      { matriculaId: 42 },
      { routingKey: MATRICULA_ATUALIZADA_EVENT },
    );

    expect(deleteManyMock).toHaveBeenCalledWith([
      'gateway:matriculas:list',
      'gateway:matriculas:item:42',
    ]);
    expect(emitMock).toHaveBeenCalledWith(MATRICULA_ATUALIZADA_EVENT, {
      matriculaId: 42,
    });
  });
});
