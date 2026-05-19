import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UsuariosGatewayController } from './usuarios.gateway.controller';
import { USERS_SERVICE_TOKEN } from './gateway-tokens';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../modules/usuarios/dto/update-usuario.dto';
import { USER_MSG } from '../contracts/microservice-patterns';

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
  createdAt: new Date(),
  updatedAt: new Date(),
};

const clientMock = {
  send: jest.fn(),
};

describe('UsuariosGatewayController', () => {
  let controller: UsuariosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosGatewayController],
      providers: [{ provide: USERS_SERVICE_TOKEN, useValue: clientMock }],
    }).compile();

    controller = module.get<UsuariosGatewayController>(
      UsuariosGatewayController,
    );
    clientMock.send.mockReset();
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve encaminhar create ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(usuarioMock));

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
      const result = await controller.create(dto);

      expect(clientMock.send).toHaveBeenCalledWith(USER_MSG.create, dto);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findAll', () => {
    it('deve encaminhar findAll ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of([usuarioMock]));

      const result = await controller.findAll();

      expect(clientMock.send).toHaveBeenCalledWith(USER_MSG.findAll, {});
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findOne', () => {
    it('deve encaminhar findOne ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(usuarioMock));

      const result = await controller.findOne('1');

      expect(clientMock.send).toHaveBeenCalledWith(USER_MSG.findOne, 1);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('update', () => {
    it('deve encaminhar update ao cliente TCP', async () => {
      const dto: UpdateUsuarioDto = { nome: 'Ester Atualizada' };
      const atualizado = { ...usuarioMock, ...dto };
      clientMock.send.mockReturnValue(of(atualizado));

      const result = await controller.update('1', dto);

      expect(clientMock.send).toHaveBeenCalledWith(USER_MSG.update, {
        id: 1,
        dto,
      });
      expect(result).toEqual(atualizado);
    });
  });

  describe('remove', () => {
    it('deve encaminhar remove ao cliente TCP', async () => {
      clientMock.send.mockReturnValue(of(usuarioMock));

      const result = await controller.remove('1');

      expect(clientMock.send).toHaveBeenCalledWith(USER_MSG.remove, 1);
      expect(result).toEqual(usuarioMock);
    });
  });
});
