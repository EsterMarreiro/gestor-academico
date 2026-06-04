import { Test, TestingModule } from '@nestjs/testing';
import { ALUNO_TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoTurmaDto } from '../modules/aluno-turma/dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from '../modules/aluno-turma/dto/update-aluno-turma.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { AlunosTurmaGatewayController } from './alunos-turma.gateway.controller';
import { ALUNOS_TURMA_SERVICE_TOKEN } from './gateway-tokens';

const alunoTurmaMock = {
  id: 1,
  alunoId: 1,
  turmaId: 2,
};

const clientMock = {
  send: jest.fn(),
};

const rpcMock = {
  send: jest.fn(),
};

describe('AlunosTurmaGatewayController', () => {
  let controller: AlunosTurmaGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunosTurmaGatewayController],
      providers: [
        { provide: ALUNOS_TURMA_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get(AlunosTurmaGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to resilience service', async () => {
    const dto: CreateAlunoTurmaDto = { alunoId: 1, turmaId: 2 };
    rpcMock.send.mockResolvedValue(alunoTurmaMock);

    await expect(controller.create(dto)).resolves.toEqual(alunoTurmaMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_TURMA_MSG.create,
      dto,
      'alunos-turma-ms',
    );
  });

  it('delegates findAll to resilience service', async () => {
    rpcMock.send.mockResolvedValue([alunoTurmaMock]);

    await expect(controller.findAll()).resolves.toEqual([alunoTurmaMock]);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_TURMA_MSG.findAll,
      {},
      'alunos-turma-ms',
    );
  });

  it('delegates findOne to resilience service', async () => {
    rpcMock.send.mockResolvedValue(alunoTurmaMock);

    await expect(controller.findOne('1')).resolves.toEqual(alunoTurmaMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_TURMA_MSG.findOne,
      1,
      'alunos-turma-ms',
    );
  });

  it('delegates update to resilience service', async () => {
    const dto: UpdateAlunoTurmaDto = { turmaId: 3 };
    rpcMock.send.mockResolvedValue({ ...alunoTurmaMock, ...dto });

    await controller.update('1', dto);

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_TURMA_MSG.update,
      {
        id: 1,
        dto,
      },
      'alunos-turma-ms',
    );
  });

  it('delegates remove to resilience service', async () => {
    rpcMock.send.mockResolvedValue(alunoTurmaMock);

    await controller.remove('1');

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_TURMA_MSG.remove,
      1,
      'alunos-turma-ms',
    );
  });
});
