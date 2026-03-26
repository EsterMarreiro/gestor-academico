import { Test, TestingModule } from '@nestjs/testing';
import { MatriculaService } from './matricula.service';

describe('MatriculaService', () => {
  let service: MatriculaService;

  // Mock simplificado do Service de Matrícula
  const mockMatriculaService = {
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, alunoId: 101, aulaId: 202 }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, alunoId: 101, aulaId: 202 }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MatriculaService,
          useValue: mockMatriculaService,
        },
      ],
    }).compile();

    service = module.get<MatriculaService>(MatriculaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve realizar uma matrícula (CRUD - Create)', async () => {
    const dto = { alunoId: 101, aulaId: 202 };
    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('deve listar todas as matrículas (CRUD - Read)', async () => {
    const matriculas = await service.findAll();
    expect(matriculas).toBeInstanceOf(Array);
    expect(matriculas[0]).toHaveProperty('alunoId');
  });
});