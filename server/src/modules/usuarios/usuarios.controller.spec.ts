import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
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

const serviceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsuariosController', () => {
  let controller: UsuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        { provide: UsuariosService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create com o dto correto', async () => {
      serviceMock.create.mockResolvedValue(usuarioMock);

      const dto = { ...usuarioMock };
      const result = await controller.create(dto as any);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll e retornar a lista', async () => {
      serviceMock.findAll.mockResolvedValue([usuarioMock]);

      const result = await controller.findAll();

      expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findOne', () => {
    it('deve chamar service.findOne com o id convertido para número', async () => {
      serviceMock.findOne.mockResolvedValue(usuarioMock);

      const result = await controller.findOne('1');

      expect(serviceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('update', () => {
    it('deve chamar service.update com id e dto corretos', async () => {
      const dto = { nome: 'Ester Atualizada' };
      const atualizado = { ...usuarioMock, ...dto };
      serviceMock.update.mockResolvedValue(atualizado);

      const result = await controller.update('1', dto as any);

      expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(atualizado);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove com o id correto', async () => {
      serviceMock.remove.mockResolvedValue(usuarioMock);

      const result = await controller.remove('1');

      expect(serviceMock.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(usuarioMock);
    });
  });
});