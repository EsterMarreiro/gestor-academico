import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoGateway } from './notificacao.gateway';
import { NotificacaoService } from './notificacao.service';

describe('NotificacaoController', () => {
  let controller: NotificacaoController;
  const cacheMock = {
    get: jest.fn().mockResolvedValue([]),
    set: jest.fn().mockResolvedValue(undefined),
  };
  const gatewayMock = {
    broadcastNotification: jest.fn(),
  };
  const prismaMock = {
    notificacao: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        titulo: 'Teste',
        mensagem: 'Mensagem',
        usuarioId: null,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        deletadoEm: null,
      }),
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({
        id: 1,
        titulo: 'Teste',
        mensagem: 'Mensagem',
        usuarioId: null,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        deletadoEm: null,
      }),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacaoController],
      providers: [
        NotificacaoService,
        { provide: CACHE_MANAGER, useValue: cacheMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificacaoGateway, useValue: gatewayMock },
      ],
    }).compile();

    controller = module.get<NotificacaoController>(NotificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
