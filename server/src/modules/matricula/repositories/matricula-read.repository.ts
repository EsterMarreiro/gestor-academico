import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { rethrowMatriculaPrismaAsHttp } from '../matricula.persistence-errors';

@Injectable()
export class MatriculaReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.matricula.findMany();
    } catch (e) {
      rethrowMatriculaPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const matricula = await this.prisma.matricula.findUnique({
        where: { id },
      });

      if (!matricula) {
        throw new NotFoundException(`Matricula #${id} nao encontrada`);
      }

      return matricula;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      rethrowMatriculaPrismaAsHttp(e);
    }
  }
}
