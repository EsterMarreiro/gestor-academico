import { CreateCursosDto } from '../../dto/create-cursos.dto';

export class CreateCursoCommand {
  constructor(public readonly dto: CreateCursosDto) {}
}
