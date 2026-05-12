import { Test, TestingModule } from '@nestjs/testing';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { DisciplinaService } from './disciplina.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('DisciplinaService', () => {
  let service: DisciplinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinaService,
        {
          provide: PrismaService,
          useValue: {
            disciplina: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: DomainEventsPublisher,
          useValue: { publish: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DisciplinaService>(DisciplinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
