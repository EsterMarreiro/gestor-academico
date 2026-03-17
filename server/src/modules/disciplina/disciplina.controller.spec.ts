import { Test, TestingModule } from '@nestjs/testing';
import { DisciplinaController } from './disciplina.controller';

describe('DisciplinaController', () => {
  let controller: DisciplinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisciplinaController],
    }).compile();

    controller = module.get<DisciplinaController>(DisciplinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
