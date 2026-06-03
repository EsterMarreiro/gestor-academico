import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StatusInscricaoProfessor } from '@prisma/client';
import {
  CreateInscricaoProfessorCommand,
  GetInscricaoProfessorByIdQuery,
  ListInscricoesProfessorQuery,
  RemoveInscricaoProfessorCommand,
  UpdateInscricaoProfessorCommand,
} from './inscricao-professor.cqrs';
import { InscricaoProfessorTcpController } from './inscricao-professor.tcp.controller';

describe('InscricaoProfessorTcpController', () => {
  let controller: InscricaoProfessorTcpController;

  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricaoProfessorTcpController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(InscricaoProfessorTcpController);
    jest.clearAllMocks();
  });

  it('dispatches create via CommandBus', async () => {
    const dto = { usuarioId: 7, disciplinaId: 9 };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new CreateInscricaoProfessorCommand(dto)),
    );
  });

  it('dispatches findAll via QueryBus', async () => {
    queryBus.execute.mockResolvedValue([]);

    await controller.findAll();

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(ListInscricoesProfessorQuery),
    );
  });

  it('dispatches findOne via QueryBus', async () => {
    queryBus.execute.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new GetInscricaoProfessorByIdQuery(1)),
    );
  });

  it('dispatches update via CommandBus', async () => {
    const dto = { status: StatusInscricaoProfessor.aprovada };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new UpdateInscricaoProfessorCommand(1, dto)),
    );
  });

  it('dispatches remove via CommandBus', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new RemoveInscricaoProfessorCommand(1)),
    );
  });
});
