import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateTurmaDto } from '../modules/turmas/dto/create-turma.dto';
import { UpdateTurmaDto } from '../modules/turmas/dto/update-turma.dto';
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

describe('TurmasGatewayController', () => {
  let controller: TurmasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurmasGatewayController],
      providers: [{ provide: TURMAS_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get(TurmasGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to TCP client', async () => {
    const dto: CreateTurmaDto = {
      codigo: 'T2026-ADS-01',
      disciplinaId: 2,
      vagasTotal: 30,
    };
    clientMock.send.mockReturnValue(of(turmaMock));

    await expect(controller.create(dto)).resolves.toEqual(turmaMock);
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.create, dto);
  });

  it('delegates findAll to TCP client', async () => {
    clientMock.send.mockReturnValue(of([turmaMock]));

    await expect(controller.findAll()).resolves.toEqual([turmaMock]);
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.findAll, {});
  });

  it('delegates findOne to TCP client', async () => {
    clientMock.send.mockReturnValue(of(turmaMock));

    await expect(controller.findOne('1')).resolves.toEqual(turmaMock);
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.findOne, 1);
  });

  it('delegates update to TCP client', async () => {
    const dto: UpdateTurmaDto = { vagasTotal: 40 };
    clientMock.send.mockReturnValue(of({ ...turmaMock, ...dto }));

    await controller.update('1', dto);

    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.update, {
      id: 1,
      dto,
    });
  });

  it('delegates remove to TCP client', async () => {
    clientMock.send.mockReturnValue(of(turmaMock));

    await controller.remove('1');

    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.remove, 1);
  });
});
