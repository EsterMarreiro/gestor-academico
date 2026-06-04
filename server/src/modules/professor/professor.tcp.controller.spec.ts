import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProfessorCommand,
  GetProfessorByIdQuery,
  ListProfessoresQuery,
  RemoveProfessorCommand,
  UpdateProfessorCommand,
} from './professor.cqrs';
import { ProfessorTcpController } from './professor.tcp.controller';

describe('ProfessorTcpController', () => {
  let controller: ProfessorTcpController;

  const commandBus = { execute: jest.fn() };
  const queryBus = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorTcpController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ],
    }).compile();

    controller = module.get(ProfessorTcpController);
    jest.clearAllMocks();
  });

  it('dispatches create via CommandBus', async () => {
    const dto = { usuarioId: 20, titulacao: 'Mestre' };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new CreateProfessorCommand(dto)),
    );
  });

  it('dispatches findAll via QueryBus', async () => {
    queryBus.execute.mockResolvedValue([]);

    await controller.findAll();

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(ListProfessoresQuery),
    );
  });

  it('dispatches findOne via QueryBus', async () => {
    queryBus.execute.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new GetProfessorByIdQuery(1)),
    );
  });

  it('dispatches update via CommandBus', async () => {
    const dto = { titulacao: 'Doutor' };
    commandBus.execute.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new UpdateProfessorCommand(1, dto)),
    );
  });

  it('dispatches remove via CommandBus', async () => {
    commandBus.execute.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining(new RemoveProfessorCommand(1)),
    );
  });
});
