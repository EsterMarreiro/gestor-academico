import { Test, TestingModule } from '@nestjs/testing';
import { AlunoService } from './aluno.service';
import { AlunoTcpController } from './aluno.tcp.controller';

describe('AlunoTcpController', () => {
  let controller: AlunoTcpController;

  const alunoServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunoTcpController],
      providers: [{ provide: AlunoService, useValue: alunoServiceMock }],
    }).compile();

    controller = module.get(AlunoTcpController);
    jest.clearAllMocks();
  });

  it('delegates create to the service', async () => {
    const dto = { usuarioId: 1, numeroMatricula: 'ALU-001' };
    alunoServiceMock.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(alunoServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to the service', async () => {
    alunoServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(alunoServiceMock.findAll).toHaveBeenCalled();
  });

  it('delegates findOne to the service', async () => {
    alunoServiceMock.findOne.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(alunoServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('delegates update to the service', async () => {
    const dto = { numeroMatricula: 'ALU-002' };
    alunoServiceMock.update.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(alunoServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('delegates remove to the service', async () => {
    alunoServiceMock.remove.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(alunoServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
