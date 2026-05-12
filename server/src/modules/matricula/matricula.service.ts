import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class MatriculaService {
  constructor(private prisma: PrismaService) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'Já existe matrícula deste aluno neste curso.',
        );
      }
      if (e.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: aluno ou curso indicado não existe.',
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

  async create(createMatriculaDto: CreateMatriculaDto) {
    const data: Prisma.MatriculaCreateInput = {
      aluno: { connect: { id: createMatriculaDto.alunoId } },
      curso: { connect: { id: createMatriculaDto.cursoId } },
      ...(createMatriculaDto.status != null
        ? { status: createMatriculaDto.status }
        : {}),
    };
    try {
      return await this.prisma.matricula.create({ data });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findAll() {
    try {
      return await this.prisma.matricula.findMany();
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const matricula = await this.prisma.matricula.findUnique({
        where: { id },
      });

      if (!matricula) {
        throw new NotFoundException(`Matrícula #${id} não encontrada`);
      }

      return matricula;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.rethrowPrismaAsHttp(e);
    }
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    await this.findOne(id);

    const data: Prisma.MatriculaUpdateInput = {};
    const d = updateMatriculaDto;
    if (d.alunoId !== undefined) {
      data.aluno = { connect: { id: d.alunoId } };
    }
    if (d.cursoId !== undefined) {
      data.curso = { connect: { id: d.cursoId } };
    }
    if (d.status !== undefined) {
      data.status = d.status;
    }

    try {
      return await this.prisma.matricula.update({
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
      return await this.prisma.matricula.delete({
        where: { id },
      });
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }
}
