import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateProfessorDto } from '../modules/professor/dto/create-professor.dto';
import { UpdateProfessorDto } from '../modules/professor/dto/update-professor.dto';
import { ProfessoresGatewayController } from './professores.gateway.controller';
import { PROFESSORES_SERVICE_TOKEN } from './gateway-tokens';

const professorMock = {
  id: 1,
  usuarioId: 20,
  titulacao: 'Mestre',
};

const clientMock = {
  send: jest.fn(),
};

describe('ProfessoresGatewayController', () => {
  let controller: ProfessoresGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessoresGatewayController],
      providers: [{ provide: PROFESSORES_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get(ProfessoresGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to TCP client', async () => {
    const dto: CreateProfessorDto = { usuarioId: 20, titulacao: 'Mestre' };
    clientMock.send.mockReturnValue(of(professorMock));

    await expect(controller.create(dto)).resolves.toEqual(professorMock);
    expect(clientMock.send).toHaveBeenCalledWith(PROFESSOR_MSG.create, dto);
  });

  it('delegates findAll to TCP client', async () => {
    clientMock.send.mockReturnValue(of([professorMock]));

    await expect(controller.findAll()).resolves.toEqual([professorMock]);
    expect(clientMock.send).toHaveBeenCalledWith(PROFESSOR_MSG.findAll, {});
  });

  it('delegates findOne to TCP client', async () => {
    clientMock.send.mockReturnValue(of(professorMock));

    await expect(controller.findOne('1')).resolves.toEqual(professorMock);
    expect(clientMock.send).toHaveBeenCalledWith(PROFESSOR_MSG.findOne, 1);
  });

  it('delegates update to TCP client', async () => {
    const dto: UpdateProfessorDto = { titulacao: 'Doutor' };
    clientMock.send.mockReturnValue(of({ ...professorMock, ...dto }));

    await controller.update('1', dto);

    expect(clientMock.send).toHaveBeenCalledWith(PROFESSOR_MSG.update, {
      id: 1,
      dto,
    });
  });

  it('delegates remove to TCP client', async () => {
    clientMock.send.mockReturnValue(of(professorMock));

    await controller.remove('1');

    expect(clientMock.send).toHaveBeenCalledWith(PROFESSOR_MSG.remove, 1);
  });
});
