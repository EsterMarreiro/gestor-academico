import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { StatusInscricaoProfessor } from '@prisma/client';
import { INSCRICAO_PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/update-inscricao-professor.dto';
import { INSCRICOES_PROFESSOR_SERVICE_TOKEN } from './gateway-tokens';
import { InscricoesProfessorGatewayController } from './inscricoes-professor.gateway.controller';

const inscricaoMock = {
  id: 1,
  usuarioId: 7,
  disciplinaId: 9,
  status: StatusInscricaoProfessor.pendente,
};

const clientMock = {
  send: jest.fn(),
};

describe('InscricoesProfessorGatewayController', () => {
  let controller: InscricoesProfessorGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricoesProfessorGatewayController],
      providers: [
        {
          provide: INSCRICOES_PROFESSOR_SERVICE_TOKEN,
          useValue: clientMock,
        },
      ],
    }).compile();

    controller = module.get(InscricoesProfessorGatewayController);
    jest.clearAllMocks();
  });

  it('delegates create to TCP client', async () => {
    const dto: CreateInscricaoProfessorDto = { usuarioId: 7, disciplinaId: 9 };
    clientMock.send.mockReturnValue(of(inscricaoMock));

    await expect(controller.create(dto)).resolves.toEqual(inscricaoMock);
    expect(clientMock.send).toHaveBeenCalledWith(
      INSCRICAO_PROFESSOR_MSG.create,
      dto,
    );
  });

  it('delegates findAll to TCP client', async () => {
    clientMock.send.mockReturnValue(of([inscricaoMock]));

    await expect(controller.findAll()).resolves.toEqual([inscricaoMock]);
    expect(clientMock.send).toHaveBeenCalledWith(
      INSCRICAO_PROFESSOR_MSG.findAll,
      {},
    );
  });

  it('delegates findOne to TCP client', async () => {
    clientMock.send.mockReturnValue(of(inscricaoMock));

    await expect(controller.findOne('1')).resolves.toEqual(inscricaoMock);
    expect(clientMock.send).toHaveBeenCalledWith(
      INSCRICAO_PROFESSOR_MSG.findOne,
      1,
    );
  });

  it('delegates update to TCP client', async () => {
    const dto: UpdateInscricaoProfessorDto = {
      status: StatusInscricaoProfessor.aprovada,
    };
    clientMock.send.mockReturnValue(of({ ...inscricaoMock, ...dto }));

    await controller.update('1', dto);

    expect(clientMock.send).toHaveBeenCalledWith(
      INSCRICAO_PROFESSOR_MSG.update,
      {
        id: 1,
        dto,
      },
    );
  });

  it('delegates remove to TCP client', async () => {
    clientMock.send.mockReturnValue(of(inscricaoMock));

    await controller.remove('1');

    expect(clientMock.send).toHaveBeenCalledWith(
      INSCRICAO_PROFESSOR_MSG.remove,
      1,
    );
  });
});
