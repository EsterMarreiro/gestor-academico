import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AlunoTurmaService } from './aluno-turma.service';

const alunoTurmaMock = {
  id: 1,
  alunoId: 1,
  turmaId: 2,
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  alunoTurma: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AlunoTurmaService', () => {
  let service: AlunoTurmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoTurmaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(AlunoTurmaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a relation between aluno and turma', async () => {
    prismaMock.alunoTurma.create.mockResolvedValue(alunoTurmaMock);

    await expect(service.create({ alunoId: 1, turmaId: 2 })).resolves.toEqual(
      alunoTurmaMock,
    );
    expect(prismaMock.alunoTurma.create).toHaveBeenCalledWith({
      data: {
        aluno: { connect: { id: 1 } },
        turma: { connect: { id: 2 } },
      },
    });
  });

  it('lists all relations', async () => {
    prismaMock.alunoTurma.findMany.mockResolvedValue([alunoTurmaMock]);

    await expect(service.findAll()).resolves.toEqual([alunoTurmaMock]);
  });

  it('finds a relation by id', async () => {
    prismaMock.alunoTurma.findUnique.mockResolvedValue(alunoTurmaMock);

    await expect(service.findOne(1)).resolves.toEqual(alunoTurmaMock);
  });

  it('throws NotFoundException when relation is missing', async () => {
    prismaMock.alunoTurma.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('updates a relation', async () => {
    prismaMock.alunoTurma.findUnique.mockResolvedValue(alunoTurmaMock);
    prismaMock.alunoTurma.update.mockResolvedValue({
      ...alunoTurmaMock,
      turmaId: 3,
    });

    await expect(service.update(1, { turmaId: 3 })).resolves.toEqual({
      ...alunoTurmaMock,
      turmaId: 3,
    });
    expect(prismaMock.alunoTurma.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        turma: { connect: { id: 3 } },
      },
    });
  });

  it('removes a relation', async () => {
    prismaMock.alunoTurma.findUnique.mockResolvedValue(alunoTurmaMock);
    prismaMock.alunoTurma.delete.mockResolvedValue(alunoTurmaMock);

    await expect(service.remove(1)).resolves.toEqual(alunoTurmaMock);
  });

  it('translates duplicate relation errors', async () => {
    prismaMock.alunoTurma.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicated', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.create({ alunoId: 1, turmaId: 2 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('translates invalid foreign key errors', async () => {
    prismaMock.alunoTurma.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('fk', {
        code: 'P2003',
        clientVersion: '6.19.3',
      }),
    );
    prismaMock.alunoTurma.findUnique.mockResolvedValue(alunoTurmaMock);

    await expect(service.update(1, { turmaId: 999 })).rejects.toThrow(
      BadRequestException,
    );
  });
});
