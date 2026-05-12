import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class TurmasService {
  constructor(private prisma: PrismaService) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'Já existe uma turma com este código ou violação de unicidade.',
        );
      }
      if (e.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: a disciplina indicada não existe.',
        );
      }
      if (e.code === 'P2025') {
        throw new NotFoundException('Registo não encontrado.');
      }
      const meta =
        e.meta && typeof e.meta === 'object'
          ? JSON.stringify(e.meta)
          : undefined;
      throw new BadRequestException(
        meta
          ? `Erro na base de dados (${e.code}): ${meta}`
          : `Erro na base de dados (${e.code}).`,
      );
    }
    if (e instanceof Prisma.PrismaClientInitializationError) {
      throw new BadRequestException(
        'Não foi possível ligar à base de dados. Verifique DATABASE_URL.',
      );
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (/does not exist|relation|não existe|no such table/i.test(msg)) {
      throw new BadRequestException(
        'Esquema da base desatualizado. Execute `npx prisma migrate deploy` na pasta server.',
      );
    }
    throw new BadRequestException(
      `Erro na operação: ${msg.slice(0, 600)}`,
    );
  }

  async create(createTurmaDto: CreateTurmaDto) {
    const data: Prisma.TurmaCreateInput = {
      codigo: createTurmaDto.codigo,
      vagasTotal: createTurmaDto.vagasTotal,
      disciplina: { connect: { id: createTurmaDto.disciplinaId } },
    };
    try {
      return await this.prisma.turma.create({ data });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findAll() {
    try {
      return await this.prisma.turma.findMany();
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const turma = await this.prisma.turma.findUnique({
        where: { id },
      });

      if (!turma) {
        throw new NotFoundException(`Turma #${id} não encontrada`);
      }

      return turma;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.rethrowPrismaAsHttp(e);
    }
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    await this.findOne(id);

    const data: Prisma.TurmaUpdateInput = {};
    const d = updateTurmaDto;
    if (d.codigo !== undefined) data.codigo = d.codigo;
    if (d.vagasTotal !== undefined) data.vagasTotal = d.vagasTotal;
    if (d.disciplinaId !== undefined) {
      data.disciplina = { connect: { id: d.disciplinaId } };
    }

    try {
      return await this.prisma.turma.update({
        where: { id },
        data,
      });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.turma.delete({
        where: { id },
      });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }
}
