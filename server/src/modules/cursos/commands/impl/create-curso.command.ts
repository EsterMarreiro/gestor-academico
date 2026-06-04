import { CreateCursoDto } from '../../dto/create-curso.dto';

export class CreateCursoCommand {
  constructor(public readonly dto: CreateCursoDto) {}
}
