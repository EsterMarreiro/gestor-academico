import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoProfessorTcpController } from './inscricao-professor.tcp.controller';
import { InscricaoProfessorService } from './inscricao-professor.service';
import { StatusInscricaoProfessor } from '@prisma/client';

describe('InscricaoProfessorTcpController', () => {
  let controller: InscricaoProfessorTcpController;

  const inscricaoProfessorServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricaoProfessorTcpController],
      providers: [
        {
          provide: InscricaoProfessorService,
          useValue: inscricaoProfessorServiceMock,
        },
      ],
    }).compile();

    controller = module.get(InscricaoProfessorTcpController);
    jest.clearAllMocks();
  });

  it('delegates create to the service', async () => {
    const dto = { usuarioId: 7, disciplinaId: 9 };
    inscricaoProfessorServiceMock.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(inscricaoProfessorServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to the service', async () => {
    inscricaoProfessorServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(inscricaoProfessorServiceMock.findAll).toHaveBeenCalled();
  });

  it('delegates findOne to the service', async () => {
    inscricaoProfessorServiceMock.findOne.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(inscricaoProfessorServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('delegates update to the service', async () => {
    const dto = { status: StatusInscricaoProfessor.aprovada };
    inscricaoProfessorServiceMock.update.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(inscricaoProfessorServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('delegates remove to the service', async () => {
    inscricaoProfessorServiceMock.remove.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(inscricaoProfessorServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
