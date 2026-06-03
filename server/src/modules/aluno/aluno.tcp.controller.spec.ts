import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateAlunoCommand,
  GetAlunoByIdQuery,
  ListAlunosQuery,
  RemoveAlunoCommand,
  UpdateAlunoCommand,
} from './aluno.cqrs';
import { AlunoTcpController } from './aluno.tcp.controller';

describe('AlunoTcpController', () => {
  let controller: AlunoTcpController;

  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunoTcpController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(AlunoTcpController);
    jest.clearAllMocks();
  });

  it('dispatches create via CommandBus', async () => {
    const dto = { usuarioId: 1, numeroMatricula: 'ALU-001' };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new CreateAlunoCommand(dto)),
    );
  });

  it('dispatches findAll via QueryBus', async () => {
    queryBus.execute.mockResolvedValue([]);

    await controller.findAll();

    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(ListAlunosQuery));
  });

  it('dispatches findOne via QueryBus', async () => {
    queryBus.execute.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new GetAlunoByIdQuery(1)),
    );
  });

  it('dispatches update via CommandBus', async () => {
    const dto = { numeroMatricula: 'ALU-002' };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new UpdateAlunoCommand(1, dto)),
    );
  });

  it('dispatches remove via CommandBus', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new RemoveAlunoCommand(1)),
    );
  });
});
