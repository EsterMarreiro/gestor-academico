import { CreateAlunoTurmaDto } from '../../dto/create-aluno-turma.dto';

export class CreateAlunoTurmaCommand {
  constructor(public readonly dto: CreateAlunoTurmaDto) {}
}
