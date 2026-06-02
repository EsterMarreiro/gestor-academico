import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TURMA_ATUALIZADA_EVENT,
  TURMA_CRIADA_EVENT,
  TURMA_REMOVIDA_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { TurmasService } from './turmas.service';

const turmaMock = {
  id: 1,
  codigo: 'T2026-ADS-01',
  disciplinaId: 2,
  vagasTotal: 30,
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  turma: {
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

describe('TurmasService', () => {
  let service: TurmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurmasService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DomainEventsPublisher, useValue: domainEventsMock },
      ],
    }).compile();

    service = module.get(TurmasService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a turma and publishes an event', async () => {
    prismaMock.turma.create.mockResolvedValue(turmaMock);

    const result = await service.create({
      codigo: turmaMock.codigo,
      disciplinaId: turmaMock.disciplinaId,
      vagasTotal: turmaMock.vagasTotal,
    });

    expect(prismaMock.turma.create).toHaveBeenCalledWith({
      data: {
        codigo: turmaMock.codigo,
        vagasTotal: turmaMock.vagasTotal,
        disciplina: { connect: { id: turmaMock.disciplinaId } },
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(TURMA_CRIADA_EVENT, {
      turmaId: turmaMock.id,
      codigo: turmaMock.codigo,
      disciplinaId: turmaMock.disciplinaId,
    });
    expect(result).toEqual(turmaMock);
  });

  it('lists turmas', async () => {
    prismaMock.turma.findMany.mockResolvedValue([turmaMock]);

    await expect(service.findAll()).resolves.toEqual([turmaMock]);
  });

  it('finds a turma by id', async () => {
    prismaMock.turma.findUnique.mockResolvedValue(turmaMock);

    await expect(service.findOne(1)).resolves.toEqual(turmaMock);
  });

  it('throws NotFoundException when turma is missing', async () => {
    prismaMock.turma.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('updates a turma and publishes an event', async () => {
    prismaMock.turma.findUnique.mockResolvedValue(turmaMock);
    prismaMock.turma.update.mockResolvedValue({
      ...turmaMock,
      codigo: 'T2026-ADS-02',
    });

    const result = await service.update(1, { codigo: 'T2026-ADS-02' });

    expect(prismaMock.turma.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { codigo: 'T2026-ADS-02' },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      TURMA_ATUALIZADA_EVENT,
      {
        turmaId: 1,
        codigo: 'T2026-ADS-02',
      },
    );
    expect(result.codigo).toBe('T2026-ADS-02');
  });

  it('removes a turma and publishes an event', async () => {
    prismaMock.turma.findUnique.mockResolvedValue(turmaMock);
    prismaMock.turma.delete.mockResolvedValue(turmaMock);

    await expect(service.remove(1)).resolves.toEqual(turmaMock);
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      TURMA_REMOVIDA_EVENT,
      {
        turmaId: 1,
      },
    );
  });

  it('translates duplicate key errors', async () => {
    prismaMock.turma.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicated', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ codigo: 'dup', disciplinaId: 1, vagasTotal: 1 }),
    ).rejects.toThrow(ConflictException);
  });

  it('translates invalid relation errors', async () => {
    prismaMock.turma.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('fk', {
        code: 'P2003',
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ codigo: 'x', disciplinaId: 999, vagasTotal: 1 }),
    ).rejects.toThrow(BadRequestException);
  });
});
