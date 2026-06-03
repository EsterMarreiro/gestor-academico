import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { MatriculasGatewayController } from './matriculas.gateway.controller';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';
import { CreateMatriculaDto } from '../modules/matricula/dto/create-matricula.dto';
import { UpdateMatriculaDto } from '../modules/matricula/dto/update-matricula.dto';
import { MATRICULA_MSG } from '../contracts/microservice-patterns';
import { GatewayCacheService } from '../shared/cache/gateway-cache.service';

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

describe('MatriculasGatewayController', () => {
  let controller: MatriculasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatriculasGatewayController],
      providers: [
        { provide: MATRICULAS_SERVICE_TOKEN, useValue: clientMock },
        { provide: GatewayCacheService, useValue: cacheMock },
      ],
    }).compile();

    controller = module.get<MatriculasGatewayController>(
      MatriculasGatewayController,
    );
    clientMock.send.mockReset();
    cacheMock.remember.mockReset();
    cacheMock.delete.mockReset();
    cacheMock.deleteMany.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(matriculaMock));
    cacheMock.delete.mockResolvedValue(undefined);
    const dto: CreateMatriculaDto = { alunoId: 1, cursoId: 1 };
    const result = await controller.create(dto);
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.create, dto);
    expect(cacheMock.delete).toHaveBeenCalledWith('gateway:matriculas:list');
    expect(result).toEqual(matriculaMock);
  });

  it('findAll encaminha ao cliente TCP', async () => {
    cacheMock.remember.mockImplementation(
      async (_key: string, factory: () => Promise<unknown>) => factory(),
    );
    clientMock.send.mockReturnValue(of([matriculaMock]));
    const result = await controller.findAll();
    expect(cacheMock.remember).toHaveBeenCalledWith(
      'gateway:matriculas:list',
      expect.any(Function),
    );
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.findAll, {});
    expect(result).toEqual([matriculaMock]);
  });

  it('findOne encaminha ao cliente TCP', async () => {
    cacheMock.remember.mockImplementation(
      async (_key: string, factory: () => Promise<unknown>) => factory(),
    );
    clientMock.send.mockReturnValue(of(matriculaMock));
    const result = await controller.findOne('1');
    expect(cacheMock.remember).toHaveBeenCalledWith(
      'gateway:matriculas:item:1',
      expect.any(Function),
    );
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.findOne, 1);
    expect(result).toEqual(matriculaMock);
  });

  it('update encaminha ao cliente TCP', async () => {
    const dto: UpdateMatriculaDto = { status: 'ativa' };
    const atualizado = { ...matriculaMock, ...dto };
    cacheMock.deleteMany.mockResolvedValue(undefined);
    clientMock.send.mockReturnValue(of(atualizado));
    const result = await controller.update('1', dto);
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.update, {
      id: 1,
      dto,
    });
    expect(cacheMock.deleteMany).toHaveBeenCalledWith([
      'gateway:matriculas:list',
      'gateway:matriculas:item:1',
    ]);
    expect(result).toEqual(atualizado);
  });

  it('remove encaminha ao cliente TCP', async () => {
    cacheMock.deleteMany.mockResolvedValue(undefined);
    clientMock.send.mockReturnValue(of(matriculaMock));
    const result = await controller.remove('1');
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.remove, 1);
    expect(cacheMock.deleteMany).toHaveBeenCalledWith([
      'gateway:matriculas:list',
      'gateway:matriculas:item:1',
    ]);
    expect(result).toEqual(matriculaMock);
  });
});
