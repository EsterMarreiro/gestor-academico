import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ALUNO_ATUALIZADO_EVENT,
  ALUNO_CRIADO_EVENT,
  ALUNO_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AlunoService } from './aluno.service';

const alunoMock = {
  id: 1,
  usuarioId: 10,
  numeroMatricula: 'ALU-001',
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  aluno: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const domainEventsMock = {
  publish: jest.fn(),
};

describe('AlunoService', () => {
  let service: AlunoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DomainEventsPublisher, useValue: domainEventsMock },
      ],
    }).compile();

    service = module.get(AlunoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an aluno and publishes an event', async () => {
    prismaMock.aluno.create.mockResolvedValue(alunoMock);

    const result = await service.create({
      usuarioId: 10,
      numeroMatricula: 'ALU-001',
    });

    expect(prismaMock.aluno.create).toHaveBeenCalledWith({
      data: {
        usuario: { connect: { id: 10 } },
        numeroMatricula: 'ALU-001',
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(ALUNO_CRIADO_EVENT, {
      alunoId: 1,
      usuarioId: 10,
      numeroMatricula: 'ALU-001',
    });
    expect(result).toEqual(alunoMock);
  });

  it('lists all alunos', async () => {
    prismaMock.aluno.findMany.mockResolvedValue([alunoMock]);

    await expect(service.findAll()).resolves.toEqual([alunoMock]);
  });

  it('finds an aluno by id', async () => {
    prismaMock.aluno.findUnique.mockResolvedValue(alunoMock);

    await expect(service.findOne(1)).resolves.toEqual(alunoMock);
    expect(prismaMock.aluno.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('throws NotFoundException when aluno is missing', async () => {
    prismaMock.aluno.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('updates an aluno and publishes an event', async () => {
    prismaMock.aluno.findUnique.mockResolvedValue(alunoMock);
    prismaMock.aluno.update.mockResolvedValue({
      ...alunoMock,
      numeroMatricula: 'ALU-002',
    });

    const result = await service.update(1, { numeroMatricula: 'ALU-002' });

    expect(prismaMock.aluno.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { numeroMatricula: 'ALU-002' },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      ALUNO_ATUALIZADO_EVENT,
      {
        alunoId: 1,
        usuarioId: 10,
      },
    );
    expect(result.numeroMatricula).toBe('ALU-002');
  });

  it('removes an aluno and publishes an event', async () => {
    prismaMock.aluno.findUnique.mockResolvedValue(alunoMock);
    prismaMock.aluno.delete.mockResolvedValue(alunoMock);

    await expect(service.remove(1)).resolves.toEqual(alunoMock);
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      ALUNO_REMOVIDO_EVENT,
      {
        alunoId: 1,
      },
    );
  });

  it('translates unique constraint errors on create', async () => {
    prismaMock.aluno.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicated', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ usuarioId: 10, numeroMatricula: 'ALU-001' }),
    ).rejects.toThrow(ConflictException);
  });

  it('translates foreign key errors on update', async () => {
    prismaMock.aluno.findUnique.mockResolvedValue(alunoMock);
    prismaMock.aluno.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('fk', {
        code: 'P2003',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.update(1, { usuarioId: 999 })).rejects.toThrow(
      BadRequestException,
    );
  });
});
