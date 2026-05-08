import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { TurmasGatewayController } from './turmas.gateway.controller';
import { TURMAS_SERVICE_TOKEN } from './gateway-tokens';
import { TURMA_MSG } from '../contracts/microservice-patterns';

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

    controller = module.get<TurmasGatewayController>(TurmasGatewayController);
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao microserviço', async () => {
    const msg = 'This action adds a new turma';
    clientMock.send.mockReturnValue(of(msg));
    const dto = {} as any;
    await expect(controller.create(dto)).resolves.toEqual(msg);
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.create, dto);
  });

  it('findAll encaminha ao microserviço', async () => {
    clientMock.send.mockReturnValue(of('list'));
    await expect(controller.findAll()).resolves.toBe('list');
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.findAll, {});
  });

  it('findOne encaminha ao microserviço', async () => {
    clientMock.send.mockReturnValue(of('one'));
    await expect(controller.findOne('2')).resolves.toBe('one');
    expect(clientMock.send).toHaveBeenCalledWith(TURMA_MSG.findOne, 2);
  });
});
