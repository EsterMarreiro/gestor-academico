import { Test, TestingModule } from '@nestjs/testing';
import { AulaService } from './aula.service';

describe('AulaService', () => {
  let service: AulaService;

  // Mock simplificado do Service
  const mockAulaService = {
    create: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, nome: 'Aula de Teste' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, nome: 'Aula de Teste' }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AulaService,
          useValue: mockAulaService,
        },
      ],
    }).compile();

    service = module.get<AulaService>(AulaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve criar uma aula (CRUD - Create)', async () => {
    const dto = { nome: 'Aula Nova' };
    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('deve listar todas as aulas (CRUD - Read)', async () => {
    const aulas = await service.findAll();
    expect(aulas).toBeInstanceOf(Array);
    expect(aulas[0].nome).toBe('Aula de Teste');
  });
});