import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DISCIPLINA_ATUALIZADA_EVENT,
  DISCIPLINA_CRIADA_EVENT,
  DISCIPLINA_REMOVIDA_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { DisciplinaService } from './disciplina.service';

const disciplinaMock = {
  id: 1,
  nome: 'Algoritmos',
  descricao: 'Base de programacao',
  cursoId: 2,
  professorId: null as number | null,
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  disciplina: {
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

describe('DisciplinaService', () => {
  let service: DisciplinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinaService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DomainEventsPublisher, useValue: domainEventsMock },
      ],
    }).compile();

    service = module.get(DisciplinaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a disciplina and publishes an event', async () => {
    prismaMock.disciplina.create.mockResolvedValue(disciplinaMock);

    const result = await service.create({
      nome: disciplinaMock.nome,
      descricao: disciplinaMock.descricao ?? undefined,
      cursoId: disciplinaMock.cursoId,
    });

    expect(prismaMock.disciplina.create).toHaveBeenCalledWith({
      data: {
        nome: disciplinaMock.nome,
        descricao: disciplinaMock.descricao,
        curso: { connect: { id: disciplinaMock.cursoId } },
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      DISCIPLINA_CRIADA_EVENT,
      {
        disciplinaId: 1,
        nome: disciplinaMock.nome,
        cursoId: disciplinaMock.cursoId,
        professorId: null,
      },
    );
    expect(result).toEqual(disciplinaMock);
  });

  it('lists disciplinas', async () => {
    prismaMock.disciplina.findMany.mockResolvedValue([disciplinaMock]);

    await expect(service.findAll()).resolves.toEqual([disciplinaMock]);
  });

  it('finds a disciplina by id', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue(disciplinaMock);

    await expect(service.findOne(1)).resolves.toEqual(disciplinaMock);
  });

  it('throws NotFoundException when disciplina is missing', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('updates a disciplina and publishes an event', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue(disciplinaMock);
    prismaMock.disciplina.update.mockResolvedValue({
      ...disciplinaMock,
      nome: 'Estruturas de Dados',
    });

    const result = await service.update(1, { nome: 'Estruturas de Dados' });

    expect(prismaMock.disciplina.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Estruturas de Dados' },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      DISCIPLINA_ATUALIZADA_EVENT,
      {
        disciplinaId: 1,
        cursoId: 2,
      },
    );
    expect(result.nome).toBe('Estruturas de Dados');
  });

  it('removes a disciplina and publishes an event', async () => {
    prismaMock.disciplina.findUnique.mockResolvedValue(disciplinaMock);
    prismaMock.disciplina.delete.mockResolvedValue(disciplinaMock);

    await expect(service.remove(1)).resolves.toEqual(disciplinaMock);
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      DISCIPLINA_REMOVIDA_EVENT,
      {
        disciplinaId: 1,
      },
    );
  });

  it('translates prisma validation errors', async () => {
    prismaMock.disciplina.create.mockRejectedValue(
      new Prisma.PrismaClientValidationError('invalid', {
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ nome: 'Disciplina', cursoId: 1 }),
    ).rejects.toThrow(BadRequestException);
  });
});
