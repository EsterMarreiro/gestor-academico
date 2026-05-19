import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ALUNO_ATUALIZADO_EVENT,
  ALUNO_CRIADO_EVENT,
  ALUNO_REMOVIDO_EVENT,
} from '../../contracts/rmq.events';
import { DomainEventsPublisher } from '../../messaging/domain-events.publisher';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunoService {
  constructor(
    private prisma: PrismaService,
    private readonly domainEvents: DomainEventsPublisher,
  ) {}

  private gerarNumeroMatricula(): string {
    const suffix = randomBytes(4).toString('hex');
    return `ALU-${Date.now()}-${suffix}`;
  }

  private rethrowPrismaAsHttp(e: unknown): never {
    if (e instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'Já existe aluno com este utilizador ou com este número de matrícula.',
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

  async create(createAlunoDto: CreateAlunoDto) {
    const numeroMatricula =
      createAlunoDto.numeroMatricula?.trim() || this.gerarNumeroMatricula();
    const data: Prisma.AlunoCreateInput = {
      usuario: { connect: { id: createAlunoDto.usuarioId } },
      numeroMatricula,
    };
    try {
      const created = await this.prisma.aluno.create({ data });
      this.domainEvents.publish(ALUNO_CRIADO_EVENT, {
        alunoId: created.id,
        usuarioId: created.usuarioId,
        numeroMatricula: created.numeroMatricula,
      });
      return created;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findAll() {
    try {
      return await this.prisma.aluno.findMany();
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }

  async findOne(id: number) {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id },
      });

      if (!aluno) {
        throw new NotFoundException(`Aluno #${id} não encontrado`);
      }

      return aluno;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.rethrowPrismaAsHttp(e);
    }
  }

  async update(id: number, updateAlunoDto: UpdateAlunoDto) {
    await this.findOne(id);

    const data: Prisma.AlunoUpdateInput = {};
    const d = updateAlunoDto;
    if (d.usuarioId !== undefined) {
      data.usuario = { connect: { id: d.usuarioId } };
    }
    if (d.numeroMatricula !== undefined) {
      const t = d.numeroMatricula.trim();
      data.numeroMatricula = t || this.gerarNumeroMatricula();
    }

    try {
      const updated = await this.prisma.aluno.update({
        where: { id },
        data,
      });
      this.domainEvents.publish(ALUNO_ATUALIZADO_EVENT, {
        alunoId: updated.id,
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
      const removed = await this.prisma.aluno.delete({
        where: { id },
      });
      this.domainEvents.publish(ALUNO_REMOVIDO_EVENT, { alunoId: removed.id });
      return removed;
    } catch (e) {
      this.rethrowPrismaAsHttp(e);
    }
  }
}
