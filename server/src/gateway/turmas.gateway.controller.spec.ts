import { Test, TestingModule } from '@nestjs/testing';
import { TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateTurmaDto } from '../modules/turmas/dto/create-turma.dto';
import { UpdateTurmaDto } from '../modules/turmas/dto/update-turma.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { TURMAS_SERVICE_TOKEN } from './gateway-tokens';
import { TurmasGatewayController } from './turmas.gateway.controller';

const turmaMock = {
  id: 1,
  codigo: 'T2026-ADS-01',
  disciplinaId: 2,
  vagasTotal: 30,
};

const clientMock = {
  send: jest.fn(),
};

const rpcMock = {
  send: jest.fn(),
};

describe('TurmasGatewayController', () => {
  let controller: TurmasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurmasGatewayController],
      providers: [
        { provide: TURMAS_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get(TurmasGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to resilience service', async () => {
    const dto: CreateTurmaDto = {
      codigo: 'T2026-ADS-01',
      disciplinaId: 2,
      vagasTotal: 30,
    };
    rpcMock.send.mockResolvedValue(turmaMock);

    await expect(controller.create(dto)).resolves.toEqual(turmaMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      TURMA_MSG.create,
      dto,
      'turmas-ms',
    );
  });

  it('delegates findAll to resilience service', async () => {
    rpcMock.send.mockResolvedValue([turmaMock]);

    await expect(controller.findAll()).resolves.toEqual([turmaMock]);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      TURMA_MSG.findAll,
      {},
      'turmas-ms',
    );
  });

  it('delegates findOne to resilience service', async () => {
    rpcMock.send.mockResolvedValue(turmaMock);

    await expect(controller.findOne('1')).resolves.toEqual(turmaMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      TURMA_MSG.findOne,
      1,
      'turmas-ms',
    );
  });

  it('delegates update to resilience service', async () => {
    const dto: UpdateTurmaDto = { vagasTotal: 40 };
    rpcMock.send.mockResolvedValue({ ...turmaMock, ...dto });

    await controller.update('1', dto);

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      TURMA_MSG.update,
      {
        id: 1,
        dto,
      },
      'turmas-ms',
    );
  });

  it('delegates remove to resilience service', async () => {
    rpcMock.send.mockResolvedValue(turmaMock);

    await controller.remove('1');

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      TURMA_MSG.remove,
      1,
      'turmas-ms',
    );
  });
});
