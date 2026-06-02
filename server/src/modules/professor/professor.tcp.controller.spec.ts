import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorService } from './professor.service';
import { ProfessorTcpController } from './professor.tcp.controller';

describe('ProfessorTcpController', () => {
  let controller: ProfessorTcpController;

  const professorServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorTcpController],
      providers: [
        { provide: ProfessorService, useValue: professorServiceMock },
      ],
    }).compile();

    controller = module.get(ProfessorTcpController);
    jest.clearAllMocks();
  });

  it('delegates create to the service', async () => {
    const dto = { usuarioId: 20, titulacao: 'Mestre' };
    professorServiceMock.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(professorServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('delegates findAll to the service', async () => {
    professorServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(professorServiceMock.findAll).toHaveBeenCalled();
  });

  it('delegates findOne to the service', async () => {
    professorServiceMock.findOne.mockResolvedValue({ id: 1 });

    await controller.findOne(1);

    expect(professorServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('delegates update to the service', async () => {
    const dto = { titulacao: 'Doutor' };
    professorServiceMock.update.mockResolvedValue({ id: 1, ...dto });

    await controller.update({ id: 1, dto });

    expect(professorServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('delegates remove to the service', async () => {
    professorServiceMock.remove.mockResolvedValue({ id: 1 });

    await controller.remove(1);

    expect(professorServiceMock.remove).toHaveBeenCalledWith(1);
  });
});
