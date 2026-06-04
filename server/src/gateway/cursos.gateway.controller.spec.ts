import { Test, TestingModule } from '@nestjs/testing';
import { CURSO_MSG } from '../contracts/microservice-patterns';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { CursosGatewayController } from './cursos.gateway.controller';
import { CURSOS_SERVICE_TOKEN } from './gateway-tokens';

const cursoMock = {
  id: 1,
  nome: 'Engenharia de Software',
  descricao: 'Curso exemplo',
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  deletadoEm: null,
};

const clientMock = {
  send: jest.fn(),
};

const rpcMock = {
  send: jest.fn(),
};

describe('CursosGatewayController', () => {
  let controller: CursosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosGatewayController],
      providers: [
        { provide: CURSOS_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get<CursosGatewayController>(CursosGatewayController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve encaminhar create ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(cursoMock);

      const dto = { nome: 'Engenharia de Software', descricao: 'X' };
      const result = await controller.create(dto);

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        CURSO_MSG.create,
        dto,
        'cursos-ms',
      );
      expect(result).toEqual(cursoMock);
    });
  });

  describe('findAll', () => {
    it('deve encaminhar findAll ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue([cursoMock]);

      const result = await controller.findAll();

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        CURSO_MSG.findAll,
        {},
        'cursos-ms',
      );
      expect(result).toEqual([cursoMock]);
    });
  });

  describe('findOne', () => {
    it('deve encaminhar findOne ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(cursoMock);

      const result = await controller.findOne('1');

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        CURSO_MSG.findOne,
        1,
        'cursos-ms',
      );
      expect(result).toEqual(cursoMock);
    });
  });

  describe('update', () => {
    it('deve encaminhar update ao servico de resiliencia', async () => {
      const dto = { nome: 'Atualizado' };
      const atualizado = { ...cursoMock, ...dto };
      rpcMock.send.mockResolvedValue(atualizado);

      const result = await controller.update('1', dto);

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        CURSO_MSG.update,
        {
          id: 1,
          dto,
        },
        'cursos-ms',
      );
      expect(result).toEqual(atualizado);
    });
  });

  describe('remove', () => {
    it('deve encaminhar remove ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(cursoMock);

      const result = await controller.remove('1');

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        CURSO_MSG.remove,
        1,
        'cursos-ms',
      );
      expect(result).toEqual(cursoMock);
    });
  });
});
