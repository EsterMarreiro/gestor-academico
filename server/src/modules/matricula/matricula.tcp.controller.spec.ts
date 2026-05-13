import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MatriculaTcpController } from './matricula.tcp.controller';
import { CreateMatriculaCommand } from './commands/impl/create-matricula.command';
import { GetMatriculaByIdQuery } from './queries/impl/get-matricula-by-id.query';
import { ListMatriculasQuery } from './queries/impl/list-matriculas.query';
import { RemoveMatriculaCommand } from './commands/impl/remove-matricula.command';
import { UpdateMatriculaCommand } from './commands/impl/update-matricula.command';

describe('MatriculaTcpController', () => {
  let controller: MatriculaTcpController;
  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatriculaTcpController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(MatriculaTcpController);
    commandBus.execute.mockReset();
    queryBus.execute.mockReset();
  });

  it('create dispatches a create command', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    const dto = { alunoId: 1, cursoId: 1 };
    await controller.create(dto as any);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new CreateMatriculaCommand(dto as any)),
    );
  });

  it('findAll dispatches a list query', async () => {
    queryBus.execute.mockResolvedValue([]);

    await controller.findAll();

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(ListMatriculasQuery),
    );
  });

  it('findOne dispatches a get by id query', async () => {
    queryBus.execute.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new GetMatriculaByIdQuery(1)),
    );
  });

  it('update dispatches an update command', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.update({ id: 1, dto: { status: 'ativa' } } as any);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(
        new UpdateMatriculaCommand(1, { status: 'ativa' } as any),
      ),
    );
  });

  it('remove dispatches a remove command', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new RemoveMatriculaCommand(1)),
    );
  });
});
