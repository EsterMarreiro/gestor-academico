import { Test, TestingModule } from '@nestjs/testing';
import { AlunoTurmaService } from './aluno-turma.service';
import { AlunoTurmaTcpController } from './aluno-turma.tcp.controller';

describe('AlunoTurmaTcpController', () => {
  let controller: AlunoTurmaTcpController;

  const alunoTurmaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunoTurmaTcpController],
      providers: [
        { provide: AlunoTurmaService, useValue: alunoTurmaServiceMock },
      ],
    }).compile();

    controller = module.get(AlunoTurmaTcpController);
    jest.clearAllMocks();
  });

  it('delegates create to the service', async () => {
    const dto = { alunoId: 1, turmaId: 2 };
    alunoTurmaServiceMock.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(alunoTurmaServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to the service', async () => {
    alunoTurmaServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(alunoTurmaServiceMock.findAll).toHaveBeenCalled();
  });

  it('delegates findOne to the service', async () => {
    alunoTurmaServiceMock.findOne.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(alunoTurmaServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('delegates update to the service', async () => {
    const dto = { turmaId: 3 };
    alunoTurmaServiceMock.update.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(alunoTurmaServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('delegates remove to the service', async () => {
    alunoTurmaServiceMock.remove.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(alunoTurmaServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
