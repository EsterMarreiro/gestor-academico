import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { CursosGatewayController } from './cursos.gateway.controller';
import { CURSOS_SERVICE_TOKEN } from './gateway-tokens';
import { CURSO_MSG } from '../contracts/microservice-patterns';

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

describe('CursosGatewayController', () => {
  let controller: CursosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosGatewayController],
      providers: [{ provide: CURSOS_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get<CursosGatewayController>(CursosGatewayController);
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve encaminhar create ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(cursoMock));

      const dto = { nome: 'Engenharia de Software', descricao: 'X' };
      const result = await controller.create(dto);

      expect(clientMock.send).toHaveBeenCalledWith(CURSO_MSG.create, dto);
      expect(result).toEqual(cursoMock);
    });
  });

  describe('findAll', () => {
    it('deve encaminhar findAll ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of([cursoMock]));

      const result = await controller.findAll();

      expect(clientMock.send).toHaveBeenCalledWith(CURSO_MSG.findAll, {});
      expect(result).toEqual([cursoMock]);
    });
  });

  describe('findOne', () => {
    it('deve encaminhar findOne ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(cursoMock));

      const result = await controller.findOne('1');

      expect(clientMock.send).toHaveBeenCalledWith(CURSO_MSG.findOne, 1);
      expect(result).toEqual(cursoMock);
    });
  });

  describe('update', () => {
    it('deve encaminhar update ao cliente TCP', async () => {
      const dto = { nome: 'Atualizado' };
      const atualizado = { ...cursoMock, ...dto };
      clientMock.send.mockReturnValue(of(atualizado));

      const result = await controller.update('1', dto);

      expect(clientMock.send).toHaveBeenCalledWith(CURSO_MSG.update, {
        id: 1,
        dto,
      });
      expect(result).toEqual(atualizado);
    });
  });

  describe('remove', () => {
    it('deve encaminhar remove ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(cursoMock));

      const result = await controller.remove('1');

      expect(clientMock.send).toHaveBeenCalledWith(CURSO_MSG.remove, 1);
      expect(result).toEqual(cursoMock);
    });
  });
});
