import { Test, TestingModule } from '@nestjs/testing';
import { CursosService } from './cursos.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('CursosService', () => {
  let service: CursosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursosService,
        {
          provide: PrismaService,
          useValue: {
            curso: {
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

    service = module.get<CursosService>(CursosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
