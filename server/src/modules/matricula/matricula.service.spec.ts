import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaEventsPublisher } from '../../messaging/matricula-events.publisher';
import { MatriculaService } from './matricula.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

describe('MatriculaService', () => {
  let service: MatriculaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatriculaService,
        {
          provide: PrismaService,
          useValue: {
            matricula: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: MatriculaEventsPublisher,
          useValue: {
            publishMatriculaCriada: jest.fn(),
            publishMatriculaAtualizada: jest.fn(),
            publishMatriculaRemovida: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatriculaService>(MatriculaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
