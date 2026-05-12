import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';
import {
  CURSO_ATUALIZADO_EVENT,
  CURSO_CRIADO_EVENT,
  CURSO_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class CursosService {
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

  async create(createCursosDto: CreateCursosDto) {
    const data: Prisma.CursoCreateInput = {
      nome: createCursosDto.nome,
      descricao: createCursosDto.descricao ?? null,
    };
    try {
      const created = await this.prisma.curso.create({ data });
      this.domainEvents.publish(CURSO_CRIADO_EVENT, {
        cursoId: created.id,
        nome: created.nome,
      });
      return created;
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
      const updated = await this.prisma.curso.update({
        where: { id },
        data,
      });
      this.domainEvents.publish(CURSO_ATUALIZADO_EVENT, {
        cursoId: updated.id,
        nome: updated.nome,
      });
      return updated;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    const removed = await this.prisma.curso.delete({
      where: { id },
    });
    this.domainEvents.publish(CURSO_REMOVIDO_EVENT, { cursoId: removed.id });
    return removed;
  }
}
