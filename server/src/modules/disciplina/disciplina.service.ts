import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import {
  DISCIPLINA_ATUALIZADA_EVENT,
  DISCIPLINA_CRIADA_EVENT,
  DISCIPLINA_REMOVIDA_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DisciplinaService {
  constructor(
    private prisma: PrismaService,
    private readonly domainEvents: DomainEventsPublisher,
  ) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    throw e;
  }

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    const data: Prisma.DisciplinaCreateInput = {
      nome: createDisciplinaDto.nome,
      descricao: createDisciplinaDto.descricao ?? null,
      curso: { connect: { id: createDisciplinaDto.cursoId } },
      ...(createDisciplinaDto.professorId != null
        ? {
            professor: { connect: { id: createDisciplinaDto.professorId } },
          }
        : {}),
    };
    try {
      const created = await this.prisma.disciplina.create({ data });
      this.domainEvents.publish(DISCIPLINA_CRIADA_EVENT, {
        disciplinaId: created.id,
        nome: created.nome,
        cursoId: created.cursoId,
        professorId: created.professorId ?? null,
      });
      return created;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  findAll() {
    return this.prisma.disciplina.findMany();
  }

  async findOne(id: number) {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id },
    });

    if (!disciplina) {
      throw new NotFoundException(`Disciplina #${id} não encontrada`);
    }

    return disciplina;
  }

  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    await this.findOne(id);

    const data: Prisma.DisciplinaUpdateInput = {};
    const d = updateDisciplinaDto;
    if (d.nome !== undefined) data.nome = d.nome;
    if (d.descricao !== undefined) data.descricao = d.descricao ?? null;
    if (d.cursoId !== undefined) {
      data.curso = { connect: { id: d.cursoId } };
    }
    if (d.professorId !== undefined) {
      if (d.professorId === null) {
        data.professor = { disconnect: true };
      } else {
        data.professor = { connect: { id: d.professorId } };
      }
    }

    try {
      const updated = await this.prisma.disciplina.update({
        where: { id },
        data,
      });
      this.domainEvents.publish(DISCIPLINA_ATUALIZADA_EVENT, {
        disciplinaId: updated.id,
        cursoId: updated.cursoId,
      });
      return updated;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    const removed = await this.prisma.disciplina.delete({
      where: { id },
    });
    this.domainEvents.publish(DISCIPLINA_REMOVIDA_EVENT, {
      disciplinaId: removed.id,
    });
    return removed;
  }
}
