import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateMatriculaDto } from '../dto/create-matricula.dto';
import { UpdateMatriculaDto } from '../dto/update-matricula.dto';
import { rethrowMatriculaPrismaAsHttp } from '../matricula.persistence-errors';

@Injectable()
export class MatriculaWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      rethrowMatriculaPrismaAsHttp(e);
    }
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
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
      rethrowMatriculaPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.matricula.delete({
        where: { id },
      });
    } catch (e) {
      rethrowMatriculaPrismaAsHttp(e);
    }
  }
}
