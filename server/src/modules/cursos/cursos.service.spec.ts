import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CURSO_ATUALIZADO_EVENT,
  CURSO_CRIADO_EVENT,
  CURSO_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CursosService } from './cursos.service';

const prismaMock = {
  curso: {
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

describe('CursosService', () => {
  let service: CursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: DomainEventsPublisher,
          useValue: domainEventsMock,
        },
      ],
    }).compile();

    service = module.get<CursosService>(CursosService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course and publish the created event', async () => {
    prismaMock.curso.create.mockResolvedValue({
      id: 10,
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });

    const result = await service.create({
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });

    expect(prismaMock.curso.create).toHaveBeenCalledWith({
      data: {
        nome: 'Arquitetura de Software',
        descricao: 'DDD e microsservicos',
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(CURSO_CRIADO_EVENT, {
      cursoId: 10,
      nome: 'Arquitetura de Software',
    });
    expect(result).toEqual({
      id: 10,
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });
  });

  it('should throw NotFoundException when course does not exist', async () => {
    prismaMock.curso.findUnique.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toThrow(NotFoundException);
  });

  it('should update a course and publish the updated event', async () => {
    prismaMock.curso.findUnique.mockResolvedValue({
      id: 10,
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });
    prismaMock.curso.update.mockResolvedValue({
      id: 10,
      nome: 'Arquitetura de Solucoes',
      descricao: null,
    });

    const result = await service.update(10, {
      nome: 'Arquitetura de Solucoes',
      descricao: null,
    });

    expect(prismaMock.curso.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: {
        nome: 'Arquitetura de Solucoes',
        descricao: null,
      },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      CURSO_ATUALIZADO_EVENT,
      {
        cursoId: 10,
        nome: 'Arquitetura de Solucoes',
      },
    );
    expect(result).toEqual({
      id: 10,
      nome: 'Arquitetura de Solucoes',
      descricao: null,
    });
  });

  it('should remove a course and publish the removed event', async () => {
    prismaMock.curso.findUnique.mockResolvedValue({
      id: 10,
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });
    prismaMock.curso.delete.mockResolvedValue({
      id: 10,
      nome: 'Arquitetura de Software',
      descricao: 'DDD e microsservicos',
    });

    const result = await service.remove(10);

    expect(prismaMock.curso.delete).toHaveBeenCalledWith({
      where: { id: 10 },
    });
    expect(domainEventsMock.publish).toHaveBeenCalledWith(
      CURSO_REMOVIDO_EVENT,
      { cursoId: 10 },
    );
    expect(result.id).toBe(10);
  });

  it('should translate Prisma validation errors into BadRequestException', async () => {
    prismaMock.curso.create.mockRejectedValue(
      new Prisma.PrismaClientValidationError('payload invalido', {
        clientVersion: '6.19.3',
      }),
    );

    await expect(
      service.create({ nome: 'Curso inconsistente', descricao: null }),
    ).rejects.toThrow(BadRequestException);
  });
});
