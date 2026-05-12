import { Test, TestingModule } from '@nestjs/testing';
import { AulaService } from './aula.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('AulaService', () => {
  let service: AulaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AulaService,
        {
          provide: PrismaService,
          useValue: {
            aula: {
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

    service = module.get<AulaService>(AulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
