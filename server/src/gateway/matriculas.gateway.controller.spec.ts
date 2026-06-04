import { Test, TestingModule } from '@nestjs/testing';
import { MATRICULA_MSG } from '../contracts/microservice-patterns';
import { CreateMatriculaDto } from '../modules/matricula/dto/create-matricula.dto';
import { UpdateMatriculaDto } from '../modules/matricula/dto/update-matricula.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { GatewayCacheService } from '../shared/cache/gateway-cache.service';
import { MatriculasGatewayController } from './matriculas.gateway.controller';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';

const matriculaMock = {
  id: 1,
  alunoId: 1,
  cursoId: 1,
  status: 'pendente',
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  deletadoEm: null,
};

const clientMock = {
  send: jest.fn(),
};

const cacheMock = {
  remember: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

const rpcMock = {
  send: jest.fn(),
};

describe('MatriculasGatewayController', () => {
  let controller: MatriculasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatriculasGatewayController],
      providers: [
        { provide: MATRICULAS_SERVICE_TOKEN, useValue: clientMock },
        { provide: GatewayCacheService, useValue: cacheMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get<MatriculasGatewayController>(
      MatriculasGatewayController,
    );
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao servico de resiliencia', async () => {
    rpcMock.send.mockResolvedValue(matriculaMock);
    cacheMock.delete.mockResolvedValue(undefined);
    const dto: CreateMatriculaDto = { alunoId: 1, cursoId: 1 };
    const result = await controller.create(dto);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      MATRICULA_MSG.create,
      dto,
      'matriculas-ms',
    );
    expect(cacheMock.delete).toHaveBeenCalledWith('gateway:matriculas:list');
    expect(result).toEqual(matriculaMock);
  });

  it('findAll encaminha ao servico de resiliencia', async () => {
    cacheMock.remember.mockImplementation(
      async (_key: string, factory: () => Promise<unknown>) => factory(),
    );
    rpcMock.send.mockResolvedValue([matriculaMock]);
    const result = await controller.findAll();
    expect(cacheMock.remember).toHaveBeenCalledWith(
      'gateway:matriculas:list',
      expect.any(Function),
    );
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      MATRICULA_MSG.findAll,
      {},
      'matriculas-ms',
    );
    expect(result).toEqual([matriculaMock]);
  });

  it('findOne encaminha ao servico de resiliencia', async () => {
    cacheMock.remember.mockImplementation(
      async (_key: string, factory: () => Promise<unknown>) => factory(),
    );
    rpcMock.send.mockResolvedValue(matriculaMock);
    const result = await controller.findOne('1');
    expect(cacheMock.remember).toHaveBeenCalledWith(
      'gateway:matriculas:item:1',
      expect.any(Function),
    );
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      MATRICULA_MSG.findOne,
      1,
      'matriculas-ms',
    );
    expect(result).toEqual(matriculaMock);
  });

  it('update encaminha ao servico de resiliencia', async () => {
    const dto: UpdateMatriculaDto = { status: 'ativa' };
    const atualizado = { ...matriculaMock, ...dto };
    cacheMock.deleteMany.mockResolvedValue(undefined);
    rpcMock.send.mockResolvedValue(atualizado);
    const result = await controller.update('1', dto);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      MATRICULA_MSG.update,
      {
        id: 1,
        dto,
      },
      'matriculas-ms',
    );
    expect(cacheMock.deleteMany).toHaveBeenCalledWith([
      'gateway:matriculas:list',
      'gateway:matriculas:item:1',
    ]);
    expect(result).toEqual(atualizado);
  });

  it('remove encaminha ao servico de resiliencia', async () => {
    cacheMock.deleteMany.mockResolvedValue(undefined);
    rpcMock.send.mockResolvedValue(matriculaMock);
    const result = await controller.remove('1');
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      MATRICULA_MSG.remove,
      1,
      'matriculas-ms',
    );
    expect(cacheMock.deleteMany).toHaveBeenCalledWith([
      'gateway:matriculas:list',
      'gateway:matriculas:item:1',
    ]);
    expect(result).toEqual(matriculaMock);
  });
});
