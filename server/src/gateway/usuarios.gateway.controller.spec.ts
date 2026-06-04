import { Test, TestingModule } from '@nestjs/testing';
import { USER_MSG } from '../contracts/microservice-patterns';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../modules/usuarios/dto/update-usuario.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { USERS_SERVICE_TOKEN } from './gateway-tokens';
import { UsuariosGatewayController } from './usuarios.gateway.controller';

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

const rpcMock = {
  send: jest.fn(),
};

describe('UsuariosGatewayController', () => {
  let controller: UsuariosGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosGatewayController],
      providers: [
        { provide: USERS_SERVICE_TOKEN, useValue: clientMock },
        { provide: RpcResilienceService, useValue: rpcMock },
      ],
    }).compile();

    controller = module.get<UsuariosGatewayController>(
      UsuariosGatewayController,
    );
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve encaminhar create ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(usuarioMock);

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

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        USER_MSG.create,
        dto,
        'usuarios-ms',
      );
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findAll', () => {
    it('deve encaminhar findAll ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue([usuarioMock]);

      const result = await controller.findAll();

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        USER_MSG.findAll,
        {},
        'usuarios-ms',
      );
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findOne', () => {
    it('deve encaminhar findOne ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(usuarioMock);

      const result = await controller.findOne('1');

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        USER_MSG.findOne,
        1,
        'usuarios-ms',
      );
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('update', () => {
    it('deve encaminhar update ao servico de resiliencia', async () => {
      const dto: UpdateUsuarioDto = { nome: 'Ester Atualizada' };
      const atualizado = { ...usuarioMock, ...dto };
      rpcMock.send.mockResolvedValue(atualizado);

      const result = await controller.update('1', dto);

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        USER_MSG.update,
        {
          id: 1,
          dto,
        },
        'usuarios-ms',
      );
      expect(result).toEqual(atualizado);
    });
  });

  describe('remove', () => {
    it('deve encaminhar remove ao servico de resiliencia', async () => {
      rpcMock.send.mockResolvedValue(usuarioMock);

      const result = await controller.remove('1');

      expect(rpcMock.send).toHaveBeenCalledWith(
        clientMock,
        USER_MSG.remove,
        1,
        'usuarios-ms',
      );
      expect(result).toEqual(usuarioMock);
    });
  });
});
