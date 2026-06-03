import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateAlunoTurmaCommand,
  GetAlunoTurmaByIdQuery,
  ListAlunosTurmaQuery,
  RemoveAlunoTurmaCommand,
  UpdateAlunoTurmaCommand,
} from './aluno-turma.cqrs';
import { AlunoTurmaTcpController } from './aluno-turma.tcp.controller';

describe('AlunoTurmaTcpController', () => {
  let controller: AlunoTurmaTcpController;

  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunoTurmaTcpController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(AlunoTurmaTcpController);
    jest.clearAllMocks();
  });

  it('dispatches create via CommandBus', async () => {
    const dto = { alunoId: 1, turmaId: 2 };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new CreateAlunoTurmaCommand(dto)),
    );
  });

  it('dispatches findAll via QueryBus', async () => {
    queryBus.execute.mockResolvedValue([]);

    await controller.findAll();

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(ListAlunosTurmaQuery),
    );
  });

  it('dispatches findOne via QueryBus', async () => {
    queryBus.execute.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new GetAlunoTurmaByIdQuery(1)),
    );
  });

  it('dispatches update via CommandBus', async () => {
    const dto = { turmaId: 3 };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new UpdateAlunoTurmaCommand(1, dto)),
    );
  });

  it('dispatches remove via CommandBus', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new RemoveAlunoTurmaCommand(1)),
    );
  });
});
