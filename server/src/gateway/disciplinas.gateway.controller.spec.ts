import { Test, TestingModule } from '@nestjs/testing';
import { DISCIPLINA_MSG } from '../contracts/microservice-patterns';
import { CreateDisciplinaDto } from '../modules/disciplina/dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from '../modules/disciplina/dto/update-disciplina.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { DisciplinasGatewayController } from './disciplinas.gateway.controller';
import { DISCIPLINAS_SERVICE_TOKEN } from './gateway-tokens';

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

const rpcMock = {
  send: jest.fn(),
};

describe('DisciplinasGatewayController', () => {
  let controller: DisciplinasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisciplinasGatewayController],
      providers: [
        { provide: DISCIPLINAS_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get<DisciplinasGatewayController>(
      DisciplinasGatewayController,
    );
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao servico de resiliencia', async () => {
    rpcMock.send.mockResolvedValue(disciplinaMock);
    const dto: CreateDisciplinaDto = { nome: 'Algoritmos', cursoId: 1 };
    const result = await controller.create(dto);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      DISCIPLINA_MSG.create,
      dto,
      'disciplinas-ms',
    );
    expect(result).toEqual(disciplinaMock);
  });

  it('findAll encaminha ao servico de resiliencia', async () => {
    rpcMock.send.mockResolvedValue([disciplinaMock]);
    const result = await controller.findAll();
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      DISCIPLINA_MSG.findAll,
      {},
      'disciplinas-ms',
    );
    expect(result).toEqual([disciplinaMock]);
  });

  it('findOne encaminha ao servico de resiliencia', async () => {
    rpcMock.send.mockResolvedValue(disciplinaMock);
    const result = await controller.findOne('1');
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      DISCIPLINA_MSG.findOne,
      1,
      'disciplinas-ms',
    );
    expect(result).toEqual(disciplinaMock);
  });

  it('update encaminha ao servico de resiliencia', async () => {
    const dto: UpdateDisciplinaDto = { nome: 'Atualizado' };
    const atualizado = { ...disciplinaMock, ...dto };
    rpcMock.send.mockResolvedValue(atualizado);
    const result = await controller.update('1', dto);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      DISCIPLINA_MSG.update,
      {
        id: 1,
        dto,
      },
      'disciplinas-ms',
    );
    expect(result).toEqual(atualizado);
  });

  it('remove encaminha ao servico de resiliencia', async () => {
    rpcMock.send.mockResolvedValue(disciplinaMock);
    const result = await controller.remove('1');
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      DISCIPLINA_MSG.remove,
      1,
      'disciplinas-ms',
    );
    expect(result).toEqual(disciplinaMock);
  });
});
