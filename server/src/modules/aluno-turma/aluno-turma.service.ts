import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateAlunoTurmaDto } from './dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from './dto/update-aluno-turma.dto';

@Injectable()
export class AlunoTurmaService {
  constructor(private readonly prisma: PrismaService) {}

  private rethrowPrismaAsHttp(error: unknown): never {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este aluno já está vinculado a esta turma.',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: aluno ou turma não existem.',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Vínculo aluno-turma não encontrado.');
      }
    }

    throw error;
  }

  async create(createAlunoTurmaDto: CreateAlunoTurmaDto) {
    try {
      return await this.prisma.alunoTurma.create({
        data: {
          aluno: { connect: { id: createAlunoTurmaDto.alunoId } },
          turma: { connect: { id: createAlunoTurmaDto.turmaId } },
        },
      });
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.alunoTurma.findMany();
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }

  async findOne(id: number) {
    try {
      const alunoTurma = await this.prisma.alunoTurma.findUnique({
        where: { id },
      });

      if (!alunoTurma) {
        throw new NotFoundException(
          `Vínculo aluno-turma #${id} não encontrado`,
        );
      }

      return alunoTurma;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.rethrowPrismaAsHttp(error);
    }
  }

  async update(id: number, updateAlunoTurmaDto: UpdateAlunoTurmaDto) {
    await this.findOne(id);

    const data: Prisma.AlunoTurmaUpdateInput = {};
    if (updateAlunoTurmaDto.alunoId !== undefined) {
      data.aluno = { connect: { id: updateAlunoTurmaDto.alunoId } };
    }
    if (updateAlunoTurmaDto.turmaId !== undefined) {
      data.turma = { connect: { id: updateAlunoTurmaDto.turmaId } };
    }

    try {
      return await this.prisma.alunoTurma.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.alunoTurma.delete({
        where: { id },
      });
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }
}
