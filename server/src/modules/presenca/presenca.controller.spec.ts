import { Test, TestingModule } from '@nestjs/testing';
import { PresencaController } from './presenca.controller';
import { PresencaService } from './presenca.service';

describe('PresencaController', () => {
  let controller: PresencaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresencaController],
      providers: [PresencaService],
    }).compile();

    controller = module.get<PresencaController>(PresencaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
