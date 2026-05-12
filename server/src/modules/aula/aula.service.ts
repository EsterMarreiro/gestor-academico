import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import {
  AULA_ATUALIZADA_EVENT,
  AULA_CRIADA_EVENT,
  AULA_REMOVIDA_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class AulaService {
  constructor(
    private prisma: PrismaService,
    private readonly domainEvents: DomainEventsPublisher,
  ) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: a turma indicada não existe.',
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
        'Tabela em falta ou esquema desatualizado. Execute `npx prisma migrate deploy` na pasta server.',
      );
    }
    throw new BadRequestException(
      `Erro na operação: ${msg.slice(0, 600)}`,
    );
  }

  async create(createAulaDto: CreateAulaDto) {
    const data: Prisma.AulaCreateInput = {
      turma: { connect: { id: createAulaDto.turmaId } },
      titulo: createAulaDto.titulo ?? null,
      dataInicio: createAulaDto.dataInicio,
      dataFim: createAulaDto.dataFim ?? null,
      conteudo: createAulaDto.conteudo ?? null,
    };
    try {
      const created = await this.prisma.aula.create({ data });
      this.domainEvents.publish(AULA_CRIADA_EVENT, {
        aulaId: created.id,
        turmaId: created.turmaId,
      });
      return created;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findAll() {
    try {
      return await this.prisma.aula.findMany();
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const aula = await this.prisma.aula.findUnique({
        where: { id },
      });

      if (!aula) {
        throw new NotFoundException(`Aula #${id} não encontrada`);
      }

      return aula;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.rethrowPrismaAsHttp(e);
    }
  }

  async update(id: number, updateAulaDto: UpdateAulaDto) {
    await this.findOne(id);

    const data: Prisma.AulaUpdateInput = {};
    const d = updateAulaDto;
    if (d.turmaId !== undefined) {
      data.turma = { connect: { id: d.turmaId } };
    }
    if (d.titulo !== undefined) data.titulo = d.titulo ?? null;
    if (d.dataInicio !== undefined) data.dataInicio = d.dataInicio;
    if (d.dataFim !== undefined) data.dataFim = d.dataFim ?? null;
    if (d.conteudo !== undefined) data.conteudo = d.conteudo ?? null;

    try {
      const updated = await this.prisma.aula.update({
        where: { id },
        data,
      });
      this.domainEvents.publish(AULA_ATUALIZADA_EVENT, { aulaId: updated.id });
      return updated;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      const removed = await this.prisma.aula.delete({
        where: { id },
      });
      this.domainEvents.publish(AULA_REMOVIDA_EVENT, { aulaId: removed.id });
      return removed;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }
}
