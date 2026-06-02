import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ALUNO_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoDto } from '../modules/aluno/dto/create-aluno.dto';
import { UpdateAlunoDto } from '../modules/aluno/dto/update-aluno.dto';
import { AlunosGatewayController } from './alunos.gateway.controller';
import { ALUNOS_SERVICE_TOKEN } from './gateway-tokens';

const alunoMock = {
  id: 1,
  usuarioId: 10,
  numeroMatricula: 'ALU-001',
};

const clientMock = {
  send: jest.fn(),
};

describe('AlunosGatewayController', () => {
  let controller: AlunosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunosGatewayController],
      providers: [{ provide: ALUNOS_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get(AlunosGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to TCP client', async () => {
    const dto: CreateAlunoDto = { usuarioId: 10, numeroMatricula: 'ALU-001' };
    clientMock.send.mockReturnValue(of(alunoMock));

    await expect(controller.create(dto)).resolves.toEqual(alunoMock);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_MSG.create, dto);
  });

  it('delegates findAll to TCP client', async () => {
    clientMock.send.mockReturnValue(of([alunoMock]));

    await expect(controller.findAll()).resolves.toEqual([alunoMock]);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_MSG.findAll, {});
  });

  it('delegates findOne to TCP client', async () => {
    clientMock.send.mockReturnValue(of(alunoMock));

    await expect(controller.findOne('1')).resolves.toEqual(alunoMock);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_MSG.findOne, 1);
  });

  it('delegates update to TCP client', async () => {
    const dto: UpdateAlunoDto = { numeroMatricula: 'ALU-002' };
    clientMock.send.mockReturnValue(of({ ...alunoMock, ...dto }));

    await controller.update('1', dto);

    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_MSG.update, {
      id: 1,
      dto,
    });
  });

  it('delegates remove to TCP client', async () => {
    clientMock.send.mockReturnValue(of(alunoMock));

    await controller.remove('1');

    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_MSG.remove, 1);
  });
});
