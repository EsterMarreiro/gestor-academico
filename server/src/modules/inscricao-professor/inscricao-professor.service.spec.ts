import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusInscricaoProfessor } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { InscricaoProfessorService } from './inscricao-professor.service';

const inscricaoMock = {
  id: 1,
  usuarioId: 7,
  disciplinaId: 9,
  status: StatusInscricaoProfessor.pendente,
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  disciplina: {
    findUnique: jest.fn(),
  },
  inscricaoProfessor: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('InscricaoProfessorService', () => {
  let service: InscricaoProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscricaoProfessorService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(InscricaoProfessorService);
    jest.clearAllMocks();
    prismaMock.disciplina.findUnique.mockResolvedValue({
      id: 9,
      professorId: null,
    });
    prismaMock.inscricaoProfessor.findFirst.mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an inscricao after checking disciplina availability', async () => {
    prismaMock.inscricaoProfessor.create.mockResolvedValue(inscricaoMock);

    await expect(
      service.create({ usuarioId: 7, disciplinaId: 9 }),
    ).resolves.toEqual(inscricaoMock);
    expect(prismaMock.inscricaoProfessor.create).toHaveBeenCalledWith({
      data: {
        usuario: { connect: { id: 7 } },
        disciplina: { connect: { id: 9 } },
        status: StatusInscricaoProfessor.pendente,
      },
    });
  });

  it('lists all inscricoes', async () => {
    prismaMock.inscricaoProfessor.findMany.mockResolvedValue([inscricaoMock]);

    await expect(service.findAll()).resolves.toEqual([inscricaoMock]);
  });

  it('finds an inscricao by id', async () => {
    prismaMock.inscricaoProfessor.findUnique.mockResolvedValue(inscricaoMock);

    await expect(service.findOne(1)).resolves.toEqual(inscricaoMock);
  });

  it('throws NotFoundException when inscricao is missing', async () => {
    prismaMock.inscricaoProfessor.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('updates an inscricao', async () => {
    prismaMock.inscricaoProfessor.findUnique.mockResolvedValue(inscricaoMock);
    prismaMock.inscricaoProfessor.update.mockResolvedValue({
      ...inscricaoMock,
      status: StatusInscricaoProfessor.aprovada,
    });

    await expect(
      service.update(1, { status: StatusInscricaoProfessor.aprovada }),
    ).resolves.toEqual({
      ...inscricaoMock,
      status: StatusInscricaoProfessor.aprovada,
    });
  });

  it('removes an inscricao', async () => {
    prismaMock.inscricaoProfessor.findUnique.mockResolvedValue(inscricaoMock);
    prismaMock.inscricaoProfessor.delete.mockResolvedValue(inscricaoMock);

    await expect(service.remove(1)).resolves.toEqual(inscricaoMock);
  });

  it('throws ConflictException when disciplina already has professor', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue({
      id: 9,
      professorId: 3,
    });

    await expect(
      service.create({ usuarioId: 7, disciplinaId: 9 }),
    ).rejects.toThrow(ConflictException);
  });

  it('throws BadRequestException when disciplina does not exist', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue(null);

    await expect(
      service.create({ usuarioId: 7, disciplinaId: 999 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('translates duplicate inscricao errors', async () => {
    prismaMock.inscricaoProfessor.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicated', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ usuarioId: 7, disciplinaId: 9 }),
    ).rejects.toThrow(ConflictException);
  });
});
