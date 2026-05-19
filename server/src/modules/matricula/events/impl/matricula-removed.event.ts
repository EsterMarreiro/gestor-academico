import type { Matricula } from '@prisma/client';

export class MatriculaRemovedEvent {
  constructor(public readonly matricula: Matricula) {}
}
