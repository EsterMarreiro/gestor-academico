import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  PROFESSOR_ATUALIZADO_EVENT,
  PROFESSOR_CRIADO_EVENT,
  PROFESSOR_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorService {
  constructor(
    private prisma: PrismaService,
    private readonly domainEvents: DomainEventsPublisher,
  ) {}

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'Já existe professor associado a este utilizador.',
        );
      }
      if (e.code === 'P2003') {
        throw new BadRequestException(
          'Referência inválida: o utilizador indicado não existe.',
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
    throw new BadRequestException(`Erro na operação: ${msg.slice(0, 600)}`);
  }

  async create(createProfessorDto: CreateProfessorDto) {
    const data: Prisma.ProfessorCreateInput = {
      usuario: { connect: { id: createProfessorDto.usuarioId } },
      titulacao: createProfessorDto.titulacao?.trim() ?? null,
    };
    try {
      const created = await this.prisma.professor.create({ data });
      this.domainEvents.publish(PROFESSOR_CRIADO_EVENT, {
        professorId: created.id,
        usuarioId: created.usuarioId,
      });
      return created;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findAll() {
    try {
      return await this.prisma.professor.findMany();
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const professor = await this.prisma.professor.findUnique({
        where: { id },
      });

      if (!professor) {
        throw new NotFoundException(`Professor #${id} não encontrado`);
      }

      return professor;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.rethrowPrismaAsHttp(e);
    }
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto) {
    await this.findOne(id);

    const data: Prisma.ProfessorUpdateInput = {};
    const d = updateProfessorDto;
    if (d.usuarioId !== undefined) {
      data.usuario = { connect: { id: d.usuarioId } };
    }
    if (d.titulacao !== undefined) {
      data.titulacao = d.titulacao?.trim() ?? null;
    }

    try {
      const updated = await this.prisma.professor.update({
        where: { id },
        data,
      });
      this.domainEvents.publish(PROFESSOR_ATUALIZADO_EVENT, {
        professorId: updated.id,
        usuarioId: updated.usuarioId,
      });
      return updated;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      const removed = await this.prisma.professor.delete({
        where: { id },
      });
      this.domainEvents.publish(PROFESSOR_REMOVIDO_EVENT, {
        professorId: removed.id,
      });
      return removed;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }
}
