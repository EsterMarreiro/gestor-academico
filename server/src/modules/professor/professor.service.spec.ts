import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PROFESSOR_ATUALIZADO_EVENT,
  PROFESSOR_CRIADO_EVENT,
  PROFESSOR_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProfessorService } from './professor.service';

const professorMock = {
  id: 1,
  usuarioId: 20,
  titulacao: 'Mestre',
  criadoEm: new Date('2026-01-01T00:00:00.000Z'),
  atualizadoEm: new Date('2026-01-01T00:00:00.000Z'),
  deletadoEm: null as Date | null,
};

const prismaMock = {
  professor: {
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

describe('ProfessorService', () => {
  let service: ProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: DomainEventsPublisher, useValue: domainEventsMock },
      ],
    }).compile();

    service = module.get(ProfessorService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a professor and publishes an event', async () => {
    prismaMock.professor.create.mockResolvedValue(professorMock);

    const result = await service.create({ usuarioId: 20, titulacao: 'Mestre' });

    expect(prismaMock.professor.create).toHaveBeenCalledWith({
      data: {
        usuario: { connect: { id: 20 } },
        titulacao: 'Mestre',
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      PROFESSOR_CRIADO_EVENT,
      {
        professorId: 1,
        usuarioId: 20,
      },
    );
    expect(result).toEqual(professorMock);
  });

  it('lists all professores', async () => {
    prismaMock.professor.findMany.mockResolvedValue([professorMock]);

    await expect(service.findAll()).resolves.toEqual([professorMock]);
  });

  it('finds a professor by id', async () => {
    prismaMock.professor.findUnique.mockResolvedValue(professorMock);

    await expect(service.findOne(1)).resolves.toEqual(professorMock);
  });

  it('throws NotFoundException when professor is missing', async () => {
    prismaMock.professor.findUnique.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toThrow(NotFoundException);
  });

  it('updates a professor and publishes an event', async () => {
    prismaMock.professor.findUnique.mockResolvedValue(professorMock);
    prismaMock.professor.update.mockResolvedValue({
      ...professorMock,
      titulacao: 'Doutor',
    });

    const result = await service.update(1, { titulacao: 'Doutor' });

    expect(prismaMock.professor.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { titulacao: 'Doutor' },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      PROFESSOR_ATUALIZADO_EVENT,
      {
        professorId: 1,
        usuarioId: 20,
      },
    );
    expect(result.titulacao).toBe('Doutor');
  });

  it('removes a professor and publishes an event', async () => {
    prismaMock.professor.findUnique.mockResolvedValue(professorMock);
    prismaMock.professor.delete.mockResolvedValue(professorMock);

    await expect(service.remove(1)).resolves.toEqual(professorMock);
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      PROFESSOR_REMOVIDO_EVENT,
      {
        professorId: 1,
      },
    );
  });

  it('translates unique constraint errors on create', async () => {
    prismaMock.professor.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicated', {
        code: 'P2002',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.create({ usuarioId: 20 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('translates foreign key errors on update', async () => {
    prismaMock.professor.findUnique.mockResolvedValue(professorMock);
    prismaMock.professor.update.mockRejectedValue(
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
