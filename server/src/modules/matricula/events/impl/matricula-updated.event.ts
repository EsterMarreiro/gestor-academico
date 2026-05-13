export class MatriculaUpdatedEvent<TMatricula = unknown> {
  constructor(public readonly matricula: TMatricula) {}
}
