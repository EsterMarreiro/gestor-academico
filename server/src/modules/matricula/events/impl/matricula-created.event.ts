export class MatriculaCreatedEvent<TMatricula = unknown> {
  constructor(public readonly matricula: TMatricula) {}
}
