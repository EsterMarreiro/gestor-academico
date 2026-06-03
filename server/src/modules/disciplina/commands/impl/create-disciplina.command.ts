import { CreateDisciplinaDto } from '../../dto/create-disciplina.dto';

export class CreateDisciplinaCommand {
  constructor(public readonly dto: CreateDisciplinaDto) {}
}
