import type { Matricula } from '@prisma/client';

export class MatriculaUpdatedEvent {
  constructor(public readonly matricula: Matricula) {}
}
