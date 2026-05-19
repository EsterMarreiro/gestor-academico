import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsuarioEventsPublisher } from '../../messaging/usuario-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

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
  complemento: null as string | null,
  isAdmin: false,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  deletadoEm: null as Date | null,
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
  const usuarioEventsMock = {
    publishUsuarioCriado: jest.fn(),
    publishUsuarioAtualizado: jest.fn(),
    publishUsuarioRemovido: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: UsuarioEventsPublisher,
          useValue: usuarioEventsMock,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuarioEventsMock.publishUsuarioCriado.mockReset();
    usuarioEventsMock.publishUsuarioAtualizado.mockReset();
    usuarioEventsMock.publishUsuarioRemovido.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário e retorná-lo', async () => {
      prismaMock.usuario.create.mockResolvedValue(usuarioMock);

      const dto: CreateUsuarioDto = {
        nome: usuarioMock.nome,
        email: usuarioMock.email,
        senha: usuarioMock.senha,
        cpf: usuarioMock.cpf,
        telefone: usuarioMock.telefone,
        dataNascimento: usuarioMock.dataNascimento,
        cep: usuarioMock.cep,
        estado: usuarioMock.estado,
        cidade: usuarioMock.cidade,
        rua: usuarioMock.rua,
        numero: usuarioMock.numero,
        complemento: usuarioMock.complemento ?? undefined,
      };

      const result = await service.create(dto);

      expect(usuarioEventsMock.publishUsuarioCriado).toHaveBeenCalledWith({
        id: usuarioMock.id,
        nome: usuarioMock.nome,
        email: usuarioMock.email,
        isAdmin: usuarioMock.isAdmin,
      });
      expect(prismaMock.usuario.create).toHaveBeenCalledWith({
        data: {
          nome: dto.nome,
          email: dto.email,
          senha: dto.senha,
          cpf: dto.cpf,
          telefone: dto.telefone,
          dataNascimento: dto.dataNascimento,
          cep: dto.cep,
          estado: dto.estado,
          cidade: dto.cidade,
          rua: dto.rua,
          numero: dto.numero,
          complemento: null,
        },
      });
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

      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(usuarioMock);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o usuário', async () => {
      const dto: UpdateUsuarioDto = { nome: 'Ester Atualizada' };
      const atualizado = { ...usuarioMock, ...dto };

      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
      prismaMock.usuario.update.mockResolvedValue(atualizado);

      const result = await service.update(1, dto);

      expect(usuarioEventsMock.publishUsuarioAtualizado).toHaveBeenCalledWith({
        id: atualizado.id,
        nome: atualizado.nome,
        email: atualizado.email,
        isAdmin: atualizado.isAdmin,
      });
      expect(prismaMock.usuario.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'Ester Atualizada' },
      });
      expect(result).toEqual(atualizado);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update(99, {} as UpdateUsuarioDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve deletar o usuário', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
      prismaMock.usuario.delete.mockResolvedValue(usuarioMock);

      const result = await service.remove(1);

      expect(usuarioEventsMock.publishUsuarioRemovido).toHaveBeenCalledWith(1);
      expect(prismaMock.usuario.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(usuarioMock);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
