import { StatusInscricaoProfessor } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { INSCRICAO_PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/update-inscricao-professor.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { INSCRICOES_PROFESSOR_SERVICE_TOKEN } from './gateway-tokens';
import { InscricoesProfessorGatewayController } from './inscricoes-professor.gateway.controller';

const inscricaoMock = {
  id: 1,
  usuarioId: 7,
  disciplinaId: 9,
  status: StatusInscricaoProfessor.pendente,
};

const clientMock = {
  send: jest.fn(),
};

const rpcMock = {
  send: jest.fn(),
};

describe('InscricoesProfessorGatewayController', () => {
  let controller: InscricoesProfessorGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricoesProfessorGatewayController],
      providers: [
        {
          provide: INSCRICOES_PROFESSOR_SERVICE_TOKEN,
          useValue: clientMock,
        },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get(InscricoesProfessorGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to resilience service', async () => {
    const dto: CreateInscricaoProfessorDto = { usuarioId: 7, disciplinaId: 9 };
    rpcMock.send.mockResolvedValue(inscricaoMock);

    await expect(controller.create(dto)).resolves.toEqual(inscricaoMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      INSCRICAO_PROFESSOR_MSG.create,
      dto,
      'inscricoes-professor-ms',
    );
  });

  it('delegates findAll to resilience service', async () => {
    rpcMock.send.mockResolvedValue([inscricaoMock]);

    await expect(controller.findAll()).resolves.toEqual([inscricaoMock]);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      INSCRICAO_PROFESSOR_MSG.findAll,
      {},
      'inscricoes-professor-ms',
    );
  });

  it('delegates findOne to resilience service', async () => {
    rpcMock.send.mockResolvedValue(inscricaoMock);

    await expect(controller.findOne('1')).resolves.toEqual(inscricaoMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      INSCRICAO_PROFESSOR_MSG.findOne,
      1,
      'inscricoes-professor-ms',
    );
  });

  it('delegates update to resilience service', async () => {
    const dto: UpdateInscricaoProfessorDto = {
      status: StatusInscricaoProfessor.aprovada,
    };
    rpcMock.send.mockResolvedValue({ ...inscricaoMock, ...dto });

    await controller.update('1', dto);

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      INSCRICAO_PROFESSOR_MSG.update,
      {
        id: 1,
        dto,
      },
      'inscricoes-professor-ms',
    );
  });

  it('delegates remove to resilience service', async () => {
    rpcMock.send.mockResolvedValue(inscricaoMock);

    await controller.remove('1');

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      INSCRICAO_PROFESSOR_MSG.remove,
      1,
      'inscricoes-professor-ms',
    );
  });
});
