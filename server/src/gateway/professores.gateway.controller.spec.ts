import { Test, TestingModule } from '@nestjs/testing';
import { PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateProfessorDto } from '../modules/professor/dto/create-professor.dto';
import { UpdateProfessorDto } from '../modules/professor/dto/update-professor.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
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

const rpcMock = {
  send: jest.fn(),
};

describe('ProfessoresGatewayController', () => {
  let controller: ProfessoresGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessoresGatewayController],
      providers: [
        { provide: PROFESSORES_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get(ProfessoresGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to resilience service', async () => {
    const dto: CreateProfessorDto = { usuarioId: 20, titulacao: 'Mestre' };
    rpcMock.send.mockResolvedValue(professorMock);

    await expect(controller.create(dto)).resolves.toEqual(professorMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      PROFESSOR_MSG.create,
      dto,
      'professores-ms',
    );
  });

  it('delegates findAll to resilience service', async () => {
    rpcMock.send.mockResolvedValue([professorMock]);

    await expect(controller.findAll()).resolves.toEqual([professorMock]);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      PROFESSOR_MSG.findAll,
      {},
      'professores-ms',
    );
  });

  it('delegates findOne to resilience service', async () => {
    rpcMock.send.mockResolvedValue(professorMock);

    await expect(controller.findOne('1')).resolves.toEqual(professorMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      PROFESSOR_MSG.findOne,
      1,
      'professores-ms',
    );
  });

  it('delegates update to resilience service', async () => {
    const dto: UpdateProfessorDto = { titulacao: 'Doutor' };
    rpcMock.send.mockResolvedValue({ ...professorMock, ...dto });

    await controller.update('1', dto);

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      PROFESSOR_MSG.update,
      {
        id: 1,
        dto,
      },
      'professores-ms',
    );
  });

  it('delegates remove to resilience service', async () => {
    rpcMock.send.mockResolvedValue(professorMock);

    await controller.remove('1');

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      PROFESSOR_MSG.remove,
      1,
      'professores-ms',
    );
  });
});
