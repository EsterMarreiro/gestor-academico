import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    throw e;
  }

  async create(createCursosDto: CreateCursosDto) {
    const data: Prisma.CursoCreateInput = {
      nome: createCursosDto.nome,
      descricao: createCursosDto.descricao ?? null,
    };
    try {
      return await this.prisma.curso.create({ data });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  findAll() {
    return this.prisma.curso.findMany();
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
    });

    if (!curso) {
      throw new NotFoundException(`Curso #${id} não encontrado`);
    }

    return curso;
  }

  async update(id: number, updateCursosDto: UpdateCursosDto) {
    await this.findOne(id);

    const data: Prisma.CursoUpdateInput = {};
    const d = updateCursosDto;
    if (d.nome !== undefined) data.nome = d.nome;
    if (d.descricao !== undefined) data.descricao = d.descricao ?? null;

    try {
      return await this.prisma.curso.update({
        where: { id },
        data,
      });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.curso.delete({
      where: { id },
    });
  }
}
