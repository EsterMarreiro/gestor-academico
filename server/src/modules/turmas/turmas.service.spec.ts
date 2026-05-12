import { Test, TestingModule } from '@nestjs/testing';
import { TurmasService } from './turmas.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('TurmasService', () => {
  let service: TurmasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurmasService,
        {
          provide: PrismaService,
          useValue: {
            turma: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TurmasService>(TurmasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
