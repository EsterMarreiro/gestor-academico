import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { MatriculasGatewayController } from './matriculas.gateway.controller';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';
import { MATRICULA_MSG } from '../contracts/microservice-patterns';

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

describe('MatriculasGatewayController', () => {
  let controller: MatriculasGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatriculasGatewayController],
      providers: [
        { provide: MATRICULAS_SERVICE_TOKEN, useValue: clientMock },
      ],
    }).compile();

    controller = module.get<MatriculasGatewayController>(
      MatriculasGatewayController,
    );
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(matriculaMock));
    const dto = { alunoId: 1, cursoId: 1 };
    const result = await controller.create(dto as any);
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.create, dto);
    expect(result).toEqual(matriculaMock);
  });

  it('findAll encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of([matriculaMock]));
    const result = await controller.findAll();
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.findAll, {});
    expect(result).toEqual([matriculaMock]);
  });

  it('findOne encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(matriculaMock));
    const result = await controller.findOne('1');
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.findOne, 1);
    expect(result).toEqual(matriculaMock);
  });

  it('update encaminha ao cliente TCP', async () => {
    const dto = { status: 'ativa' };
    const atualizado = { ...matriculaMock, ...dto };
    clientMock.send.mockReturnValue(of(atualizado));
    const result = await controller.update('1', dto as any);
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.update, {
      id: 1,
      dto,
    });
    expect(result).toEqual(atualizado);
  });

  it('remove encaminha ao cliente TCP', async () => {
    clientMock.send.mockReturnValue(of(matriculaMock));
    const result = await controller.remove('1');
    expect(clientMock.send).toHaveBeenCalledWith(MATRICULA_MSG.remove, 1);
    expect(result).toEqual(matriculaMock);
  });
});
