import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AulasGatewayController } from './aulas.gateway.controller';
import { AULAS_SERVICE_TOKEN } from './gateway-tokens';
import { CreateAulaDto } from '../modules/aula/dto/create-aula.dto';
import { AULA_MSG } from '../contracts/microservice-patterns';

const aulaMock = {
  id: 1,
  turmaId: 1,
  titulo: 'Introdução',
  dataInicio: new Date(),
  dataFim: null,
  conteudo: null,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  deletadoEm: null,
};

const clientMock = {
  send: jest.fn(),
};

describe('AulasGatewayController', () => {
  let controller: AulasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AulasGatewayController],
      providers: [{ provide: AULAS_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get<AulasGatewayController>(AulasGatewayController);
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(aulaMock));
    const dto: CreateAulaDto = { turmaId: 1, dataInicio: new Date() };
    const result = await controller.create(dto);
    expect(clientMock.send).toHaveBeenCalledWith(AULA_MSG.create, dto);
    expect(result).toEqual(aulaMock);
  });

  it('findAll encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of([aulaMock]));
    const result = await controller.findAll();
    expect(clientMock.send).toHaveBeenCalledWith(AULA_MSG.findAll, {});
    expect(result).toEqual([aulaMock]);
  });

  it('findOne encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(aulaMock));
    const result = await controller.findOne('1');
    expect(clientMock.send).toHaveBeenCalledWith(AULA_MSG.findOne, 1);
    expect(result).toEqual(aulaMock);
  });
});
