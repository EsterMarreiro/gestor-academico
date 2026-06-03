import { CreateTurmaDto } from '../../dto/create-turma.dto';

export class CreateTurmaCommand {
  constructor(public readonly dto: CreateTurmaDto) {}
}
