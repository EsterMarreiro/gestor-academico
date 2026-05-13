import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function rethrowMatriculaPrismaAsHttp(e: unknown): never {
  if (e instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException(e.message);
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      throw new ConflictException('Ja existe matricula deste aluno neste curso.');
    }
    if (e.code === 'P2003') {
      throw new BadRequestException(
        'Referencia invalida: aluno ou curso indicado nao existe.',
      );
    }
    if (e.code === 'P2025') {
      throw new NotFoundException('Registo nao encontrado.');
    }
    const meta =
      e.meta && typeof e.meta === 'object' ? JSON.stringify(e.meta) : undefined;
    throw new BadRequestException(
      meta
        ? `Erro na base de dados (${e.code}): ${meta}`
        : `Erro na base de dados (${e.code}).`,
    );
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    throw new BadRequestException(
      'Nao foi possivel ligar a base de dados. Verifique DATABASE_URL.',
    );
  }
  const msg = e instanceof Error ? e.message : String(e);
  if (/does not exist|relation|nao existe|no such table/i.test(msg)) {
    throw new BadRequestException(
      'Esquema da base desatualizado. Execute `npx prisma migrate deploy` na pasta server.',
    );
  }
  throw new BadRequestException(`Erro na operacao: ${msg.slice(0, 600)}`);
}
