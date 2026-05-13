import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaEventsPublisher } from '../../messaging/matricula-events.publisher';
import { EventBus } from '@nestjs/cqrs';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateMatriculaHandler } from './handlers/create-matricula.handler';
import { GetMatriculaByIdHandler } from './handlers/get-matricula-by-id.handler';
import { ListMatriculasHandler } from './handlers/list-matriculas.handler';
import { MatriculaCreatedHandler } from './handlers/matricula-created.handler';
import { MatriculaRemovedHandler } from './handlers/matricula-removed.handler';
import { MatriculaUpdatedHandler } from './handlers/matricula-updated.handler';
import { RemoveMatriculaHandler } from './handlers/remove-matricula.handler';
import { UpdateMatriculaHandler } from './handlers/update-matricula.handler';
import { MatriculaReadRepository } from './repositories/matricula-read.repository';
import { MatriculaWriteRepository } from './repositories/matricula-write.repository';
import { CreateMatriculaCommand } from './commands/impl/create-matricula.command';
import { UpdateMatriculaCommand } from './commands/impl/update-matricula.command';
import { RemoveMatriculaCommand } from './commands/impl/remove-matricula.command';
import { GetMatriculaByIdQuery } from './queries/impl/get-matricula-by-id.query';
import { MatriculaCreatedEvent } from './events/impl/matricula-created.event';
import { MatriculaRemovedEvent } from './events/impl/matricula-removed.event';
import { MatriculaUpdatedEvent } from './events/impl/matricula-updated.event';

describe('Matricula CQRS handlers', () => {
  let createHandler: CreateMatriculaHandler;
  let updateHandler: UpdateMatriculaHandler;
  let removeHandler: RemoveMatriculaHandler;
  let getByIdHandler: GetMatriculaByIdHandler;
  let listHandler: ListMatriculasHandler;
  let writeRepository: MatriculaWriteRepository;
  let readRepository: MatriculaReadRepository;
  let eventBus: { publish: jest.Mock };
  let matriculaEvents: {
    publishMatriculaCriada: jest.Mock;
    publishMatriculaAtualizada: jest.Mock;
    publishMatriculaRemovida: jest.Mock;
  };
  let createdEventHandler: MatriculaCreatedHandler;
  let updatedEventHandler: MatriculaUpdatedHandler;
  let removedEventHandler: MatriculaRemovedHandler;

  const matriculaMock = {
    id: 1,
    alunoId: 1,
    cursoId: 1,
    status: 'pendente',
  };

  beforeEach(async () => {
    eventBus = { publish: jest.fn() };
    matriculaEvents = {
      publishMatriculaCriada: jest.fn(),
      publishMatriculaAtualizada: jest.fn(),
      publishMatriculaRemovida: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatriculaReadRepository,
        MatriculaWriteRepository,
        CreateMatriculaHandler,
        UpdateMatriculaHandler,
        RemoveMatriculaHandler,
        GetMatriculaByIdHandler,
        ListMatriculasHandler,
        MatriculaCreatedHandler,
        MatriculaUpdatedHandler,
        MatriculaRemovedHandler,
        {
          provide: PrismaService,
          useValue: {
            matricula: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: MatriculaEventsPublisher,
          useValue: matriculaEvents,
        },
        { provide: EventBus, useValue: eventBus },
      ],
    }).compile();

    createHandler = module.get(CreateMatriculaHandler);
    updateHandler = module.get(UpdateMatriculaHandler);
    removeHandler = module.get(RemoveMatriculaHandler);
    getByIdHandler = module.get(GetMatriculaByIdHandler);
    listHandler = module.get(ListMatriculasHandler);
    writeRepository = module.get(MatriculaWriteRepository);
    readRepository = module.get(MatriculaReadRepository);
    createdEventHandler = module.get(MatriculaCreatedHandler);
    updatedEventHandler = module.get(MatriculaUpdatedHandler);
    removedEventHandler = module.get(MatriculaRemovedHandler);
  });

  afterEach(() => jest.clearAllMocks());

  it('handlers should be defined', () => {
    expect(createHandler).toBeDefined();
    expect(updateHandler).toBeDefined();
    expect(removeHandler).toBeDefined();
    expect(getByIdHandler).toBeDefined();
    expect(listHandler).toBeDefined();
  });

  it('create handler persists and publishes event', async () => {
    jest.spyOn(writeRepository, 'create').mockResolvedValue(matriculaMock as any);

    const result = await createHandler.execute(
      new CreateMatriculaCommand({ alunoId: 1, cursoId: 1 } as any),
    );

    expect(writeRepository.create).toHaveBeenCalledWith({
      alunoId: 1,
      cursoId: 1,
    });
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(result).toEqual(matriculaMock);
  });

  it('update handler checks existence, updates and publishes event', async () => {
    jest.spyOn(readRepository, 'findOne').mockResolvedValue(matriculaMock as any);
    jest
      .spyOn(writeRepository, 'update')
      .mockResolvedValue({ ...matriculaMock, status: 'ativa' } as any);

    const result = await updateHandler.execute(
      new UpdateMatriculaCommand(1, { status: 'ativa' } as any),
    );

    expect(readRepository.findOne).toHaveBeenCalledWith(1);
    expect(writeRepository.update).toHaveBeenCalledWith(1, { status: 'ativa' });
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...matriculaMock, status: 'ativa' });
  });

  it('remove handler checks existence, removes and publishes event', async () => {
    jest.spyOn(readRepository, 'findOne').mockResolvedValue(matriculaMock as any);
    jest.spyOn(writeRepository, 'remove').mockResolvedValue(matriculaMock as any);

    const result = await removeHandler.execute(new RemoveMatriculaCommand(1));

    expect(readRepository.findOne).toHaveBeenCalledWith(1);
    expect(writeRepository.remove).toHaveBeenCalledWith(1);
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(result).toEqual(matriculaMock);
  });

  it('get by id query reads from repository', async () => {
    jest.spyOn(readRepository, 'findOne').mockResolvedValue(matriculaMock as any);

    const result = await getByIdHandler.execute(new GetMatriculaByIdQuery(1));

    expect(readRepository.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(matriculaMock);
  });

  it('list query reads all matriculas from repository', async () => {
    jest.spyOn(readRepository, 'findAll').mockResolvedValue([matriculaMock] as any);

    const result = await listHandler.execute();

    expect(readRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([matriculaMock]);
  });

  it('created event handler publishes RMQ event', () => {
    createdEventHandler.handle(new MatriculaCreatedEvent(matriculaMock as any));

    expect(matriculaEvents.publishMatriculaCriada).toHaveBeenCalledWith(
      matriculaMock,
    );
  });

  it('updated event handler publishes RMQ event', () => {
    updatedEventHandler.handle(new MatriculaUpdatedEvent(matriculaMock as any));

    expect(matriculaEvents.publishMatriculaAtualizada).toHaveBeenCalledWith(
      matriculaMock,
    );
  });

  it('removed event handler publishes RMQ event', () => {
    removedEventHandler.handle(new MatriculaRemovedEvent(matriculaMock as any));

    expect(matriculaEvents.publishMatriculaRemovida).toHaveBeenCalledWith(1);
  });
});
