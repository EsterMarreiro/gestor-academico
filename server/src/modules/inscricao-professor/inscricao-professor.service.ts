import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusInscricaoProfessor } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateInscricaoProfessorDto } from './dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from './dto/update-inscricao-professor.dto';

@Injectable()
export class InscricaoProfessorService {
  constructor(private readonly prisma: PrismaService) {}

  private rethrowPrismaAsHttp(error: unknown): never {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Já existe inscrição deste usuário para esta disciplina.',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: usuário ou disciplina não existem.',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Inscrição de professor não encontrada.');
      }
    }

    throw error;
  }

  private async ensureDisciplinaDisponivel(
    disciplinaId: number,
    options?: {
      inscricaoId?: number;
      requireAvailability?: boolean;
    },
  ) {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id: disciplinaId },
      select: { id: true, professorId: true },
    });

    if (!disciplina) {
      throw new BadRequestException('A disciplina informada não existe.');
    }

    if (!options?.requireAvailability) {
      return;
    }

    if (disciplina.professorId !== null) {
      throw new ConflictException(
        'A disciplina já possui professor responsável e não aceita nova inscrição.',
      );
    }

    const existingApproved = await this.prisma.inscricaoProfessor.findFirst({
      where: {
        disciplinaId,
        status: StatusInscricaoProfessor.aprovada,
        ...(options?.inscricaoId ? { id: { not: options.inscricaoId } } : {}),
      },
      select: { id: true },
    });

    if (existingApproved) {
      throw new ConflictException(
        'Já existe uma inscrição aprovada para esta disciplina.',
      );
    }
  }

  async create(createDto: CreateInscricaoProfessorDto) {
    await this.ensureDisciplinaDisponivel(createDto.disciplinaId, {
      requireAvailability: true,
    });

    try {
      return await this.prisma.inscricaoProfessor.create({
        data: {
          usuario: { connect: { id: createDto.usuarioId } },
          disciplina: { connect: { id: createDto.disciplinaId } },
          status: createDto.status ?? StatusInscricaoProfessor.pendente,
        },
      });
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.inscricaoProfessor.findMany();
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }

  async findOne(id: number) {
    try {
      const inscricao = await this.prisma.inscricaoProfessor.findUnique({
        where: { id },
      });

      if (!inscricao) {
        throw new NotFoundException(
          `Inscrição de professor #${id} não encontrada`,
        );
      }

      return inscricao;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.rethrowPrismaAsHttp(error);
    }
  }

  async update(id: number, updateDto: UpdateInscricaoProfessorDto) {
    const current = await this.findOne(id);
    const disciplinaId = updateDto.disciplinaId ?? current.disciplinaId;
    await this.ensureDisciplinaDisponivel(disciplinaId, {
      inscricaoId: id,
      requireAvailability:
        updateDto.disciplinaId !== undefined ||
        updateDto.status === StatusInscricaoProfessor.aprovada,
    });

    const data: Prisma.InscricaoProfessorUpdateInput = {};
    if (updateDto.usuarioId !== undefined) {
      data.usuario = { connect: { id: updateDto.usuarioId } };
    }
    if (updateDto.disciplinaId !== undefined) {
      data.disciplina = { connect: { id: updateDto.disciplinaId } };
    }
    if (updateDto.status !== undefined) {
      data.status = updateDto.status;
    }

    try {
      return await this.prisma.inscricaoProfessor.update({
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
      return await this.prisma.inscricaoProfessor.delete({
        where: { id },
      });
    } catch (error) {
      this.rethrowPrismaAsHttp(error);
    }
  }
}
