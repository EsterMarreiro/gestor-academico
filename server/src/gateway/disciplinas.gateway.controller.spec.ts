import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { DisciplinasGatewayController } from './disciplinas.gateway.controller';
import { DISCIPLINAS_SERVICE_TOKEN } from './gateway-tokens';
import { DISCIPLINA_MSG } from '../contracts/microservice-patterns';

const disciplinaMock = {
  id: 1,
  nome: 'Algoritmos',
  descricao: null,
  cursoId: 1,
  professorId: null,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  deletadoEm: null,
};

const clientMock = {
  send: jest.fn(),
};

describe('DisciplinasGatewayController', () => {
  let controller: DisciplinasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisciplinasGatewayController],
      providers: [
        { provide: DISCIPLINAS_SERVICE_TOKEN, useValue: clientMock },
      ],
    }).compile();

    controller = module.get<DisciplinasGatewayController>(
      DisciplinasGatewayController,
    );
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(disciplinaMock));
    const dto = { nome: 'Algoritmos', cursoId: 1 };
    const result = await controller.create(dto as any);
    expect(clientMock.send).toHaveBeenCalledWith(DISCIPLINA_MSG.create, dto);
    expect(result).toEqual(disciplinaMock);
  });

  it('findAll encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of([disciplinaMock]));
    const result = await controller.findAll();
    expect(clientMock.send).toHaveBeenCalledWith(DISCIPLINA_MSG.findAll, {});
    expect(result).toEqual([disciplinaMock]);
  });

  it('findOne encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(disciplinaMock));
    const result = await controller.findOne('1');
    expect(clientMock.send).toHaveBeenCalledWith(DISCIPLINA_MSG.findOne, 1);
    expect(result).toEqual(disciplinaMock);
  });

  it('update encaminha ao cliente TCP', async () => {
    const dto = { nome: 'Atualizado' };
    const atualizado = { ...disciplinaMock, ...dto };
    clientMock.send.mockReturnValue(of(atualizado));
    const result = await controller.update('1', dto as any);
    expect(clientMock.send).toHaveBeenCalledWith(DISCIPLINA_MSG.update, {
      id: 1,
      dto,
    });
    expect(result).toEqual(atualizado);
  });

  it('remove encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(disciplinaMock));
    const result = await controller.remove('1');
    expect(clientMock.send).toHaveBeenCalledWith(DISCIPLINA_MSG.remove, 1);
    expect(result).toEqual(disciplinaMock);
  });
});
