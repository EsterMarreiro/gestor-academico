import { Logger } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaModule } from '../src/modules/matricula/matricula.module';
import { CreateMatriculaHandler } from '../src/modules/matricula/handlers/create-matricula.handler';
import { CreateMatriculaCommand } from '../src/modules/matricula/commands/impl/create-matricula.command';
import { MatriculaReadRepository } from '../src/modules/matricula/repositories/matricula-read.repository';
import { MatriculaWriteRepository } from '../src/modules/matricula/repositories/matricula-write.repository';
import { NotificacoesModule } from '../src/notifications/notificacoes.module';
import {
  RabbitMqConnectionService,
  RabbitMqSubscriptionOptions,
} from '../src/messaging/rabbitmq-connection.service';

type HandlerEntry = {
  routingKeys: string[];
  onMessage: (payload: unknown) => Promise<void> | void;
};

class InMemoryRabbitMqConnectionService {
  private readonly handlers: HandlerEntry[] = [];

  async publish(
    _exchange: string,
    routingKey: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.routingKeys.includes(routingKey)) {
        await handler.onMessage(payload);
      }
    }
  }

  async subscribe<TPayload>(
    options: RabbitMqSubscriptionOptions<TPayload>,
  ): Promise<void> {
    this.handlers.push({
      routingKeys: options.routingKeys,
      onMessage: options.onMessage as (
        payload: unknown,
      ) => Promise<void> | void,
    });
  }
}

describe('Fluxo de mensageria de matrícula (integração)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let createMatriculaHandler: CreateMatriculaHandler;
  let loggerSpy: jest.SpyInstance;

  beforeAll(async () => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    moduleRef = await Test.createTestingModule({
      imports: [MatriculaModule, NotificacoesModule],
    })
      .overrideProvider(MatriculaWriteRepository)
      .useValue({
        create: jest.fn(async (dto) => ({
          id: 1,
          alunoId: dto.alunoId,
          cursoId: dto.cursoId,
          status: dto.status ?? 'pendente',
        })),
      })
      .overrideProvider(MatriculaReadRepository)
      .useValue({})
      .overrideProvider(RabbitMqConnectionService)
      .useValue(new InMemoryRabbitMqConnectionService())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    createMatriculaHandler = app.get(CreateMatriculaHandler);
  });

  afterAll(async () => {
    loggerSpy.mockRestore();
    await app.close();
  });

  it('cria matrícula, publica matricula.criada e processa a notificação', async () => {
    const matricula = await createMatriculaHandler.execute(
      new CreateMatriculaCommand({
        alunoId: 10,
        cursoId: 20,
        status: 'ativa',
      }),
    );

    expect(matricula).toMatchObject({
      id: 1,
      alunoId: 10,
      cursoId: 20,
      status: 'ativa',
    });
    expect(loggerSpy).toHaveBeenCalledWith('[EMAIL SIMULADO] Matrícula 1');
  });
});
