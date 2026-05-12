import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEventsPublisher } from '../../messaging/usuario-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private readonly usuarioEvents: UsuarioEventsPublisher,
  ) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    throw e;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const data: Prisma.UsuarioCreateInput = {
      nome: createUsuarioDto.nome,
      email: createUsuarioDto.email,
      senha: createUsuarioDto.senha,
      cpf: createUsuarioDto.cpf,
      telefone: createUsuarioDto.telefone,
      dataNascimento: createUsuarioDto.dataNascimento,
      cep: createUsuarioDto.cep,
      estado: createUsuarioDto.estado,
      cidade: createUsuarioDto.cidade,
      rua: createUsuarioDto.rua,
      numero: createUsuarioDto.numero,
      complemento: createUsuarioDto.complemento ?? null,
    };
    try {
      const created = await this.prisma.usuario.create({ data });
      this.usuarioEvents.publishUsuarioCriado({
        id: created.id,
        nome: created.nome,
        email: created.email,
        isAdmin: created.isAdmin,
      });
      return created;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário #${id} não encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

    const data: Prisma.UsuarioUpdateInput = {};
    const d = updateUsuarioDto;
    if (d.nome !== undefined) data.nome = d.nome;
    if (d.email !== undefined) data.email = d.email;
    if (d.senha !== undefined) data.senha = d.senha;
    if (d.cpf !== undefined) data.cpf = d.cpf;
    if (d.telefone !== undefined) data.telefone = d.telefone;
    if (d.dataNascimento !== undefined)
      data.dataNascimento = d.dataNascimento;
    if (d.cep !== undefined) data.cep = d.cep;
    if (d.estado !== undefined) data.estado = d.estado;
    if (d.cidade !== undefined) data.cidade = d.cidade;
    if (d.rua !== undefined) data.rua = d.rua;
    if (d.numero !== undefined) data.numero = d.numero;
    if (d.complemento !== undefined) data.complemento = d.complemento ?? null;

    try {
      return await this.prisma.usuario.update({
        where: { id },
        data,
      });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}