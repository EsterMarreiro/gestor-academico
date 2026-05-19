import type { Matricula } from '@prisma/client';

export class MatriculaCreatedEvent {
  constructor(public readonly matricula: Matricula) {}
}
