import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ALUNO_TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoTurmaDto } from '../modules/aluno-turma/dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from '../modules/aluno-turma/dto/update-aluno-turma.dto';
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

describe('AlunosTurmaGatewayController', () => {
  let controller: AlunosTurmaGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlunosTurmaGatewayController],
      providers: [
        { provide: ALUNOS_TURMA_SERVICE_TOKEN, useValue: clientMock },
      ],
    }).compile();

    controller = module.get(AlunosTurmaGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to TCP client', async () => {
    const dto: CreateAlunoTurmaDto = { alunoId: 1, turmaId: 2 };
    clientMock.send.mockReturnValue(of(alunoTurmaMock));

    await expect(controller.create(dto)).resolves.toEqual(alunoTurmaMock);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_TURMA_MSG.create, dto);
  });

  it('delegates findAll to TCP client', async () => {
    clientMock.send.mockReturnValue(of([alunoTurmaMock]));

    await expect(controller.findAll()).resolves.toEqual([alunoTurmaMock]);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_TURMA_MSG.findAll, {});
  });

  it('delegates findOne to TCP client', async () => {
    clientMock.send.mockReturnValue(of(alunoTurmaMock));

    await expect(controller.findOne('1')).resolves.toEqual(alunoTurmaMock);
    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_TURMA_MSG.findOne, 1);
  });

  it('delegates update to TCP client', async () => {
    const dto: UpdateAlunoTurmaDto = { turmaId: 3 };
    clientMock.send.mockReturnValue(of({ ...alunoTurmaMock, ...dto }));

    await controller.update('1', dto);

    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_TURMA_MSG.update, {
      id: 1,
      dto,
    });
  });

  it('delegates remove to TCP client', async () => {
    clientMock.send.mockReturnValue(of(alunoTurmaMock));

    await controller.remove('1');

    expect(clientMock.send).toHaveBeenCalledWith(ALUNO_TURMA_MSG.remove, 1);
  });
});
