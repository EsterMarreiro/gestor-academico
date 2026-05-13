export class MatriculaRemovedEvent<TMatricula = unknown> {
  constructor(public readonly matricula: TMatricula) {}
}
