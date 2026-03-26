import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

const usuarioMock = {
  id: 1,
  nome: 'Ester',
  email: 'ester@email.com',
  senha: '123456',
  cpf: '000.000.000-00',
  telefone: '83999999999',
  dataNascimento: new Date('2000-01-01'),
  cep: '58000-000',
  estado: 'PB',
  cidade: 'João Pessoa',
  rua: 'Rua das Flores',
  numero: '10',
  complemento: null,
  tipoUsuario: TipoUsuario.ALUNO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prismaMock = {
  usuario: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário e retorná-lo', async () => {
      prismaMock.usuario.create.mockResolvedValue(usuarioMock);

      const result = await service.create(usuarioMock as any);

      expect(prismaMock.usuario.create).toHaveBeenCalledWith({ data: usuarioMock });
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      prismaMock.usuario.findMany.mockResolvedValue([usuarioMock]);

      const result = await service.findAll();

      expect(prismaMock.usuario.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findOne', () => {
    it('deve retornar o usuário pelo id', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);

      const result = await service.findOne(1);

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(usuarioMock);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o usuário', async () => {
      const dto = { nome: 'Ester Atualizada' };
      const atualizado = { ...usuarioMock, ...dto };

      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
      prismaMock.usuario.update.mockResolvedValue(atualizado);

      const result = await service.update(1, dto as any);

      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
      expect(result).toEqual(atualizado);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve deletar o usuário', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
      prismaMock.usuario.delete.mockResolvedValue(usuarioMock);

      const result = await service.remove(1);

      expect(prismaMock.usuario.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(usuarioMock);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});