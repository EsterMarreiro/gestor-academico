import { Test, TestingModule } from '@nestjs/testing';
import { ALUNO_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoDto } from '../modules/aluno/dto/create-aluno.dto';
import { UpdateAlunoDto } from '../modules/aluno/dto/update-aluno.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
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

const rpcMock = {
  send: jest.fn(),
};

describe('AlunosGatewayController', () => {
  let controller: AlunosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunosGatewayController],
      providers: [
        { provide: ALUNOS_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get(AlunosGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to resilience service', async () => {
    const dto: CreateAlunoDto = { usuarioId: 10, numeroMatricula: 'ALU-001' };
    rpcMock.send.mockResolvedValue(alunoMock);

    await expect(controller.create(dto)).resolves.toEqual(alunoMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_MSG.create,
      dto,
      'alunos-ms',
    );
  });

  it('delegates findAll to resilience service', async () => {
    rpcMock.send.mockResolvedValue([alunoMock]);

    await expect(controller.findAll()).resolves.toEqual([alunoMock]);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_MSG.findAll,
      {},
      'alunos-ms',
    );
  });

  it('delegates findOne to resilience service', async () => {
    rpcMock.send.mockResolvedValue(alunoMock);

    await expect(controller.findOne('1')).resolves.toEqual(alunoMock);
    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_MSG.findOne,
      1,
      'alunos-ms',
    );
  });

  it('delegates update to resilience service', async () => {
    const dto: UpdateAlunoDto = { numeroMatricula: 'ALU-002' };
    rpcMock.send.mockResolvedValue({ ...alunoMock, ...dto });

    await controller.update('1', dto);

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_MSG.update,
      {
        id: 1,
        dto,
      },
      'alunos-ms',
    );
  });

  it('delegates remove to resilience service', async () => {
    rpcMock.send.mockResolvedValue(alunoMock);

    await controller.remove('1');

    expect(rpcMock.send).toHaveBeenCalledWith(
      clientMock,
      ALUNO_MSG.remove,
      1,
      'alunos-ms',
    );
  });
});
