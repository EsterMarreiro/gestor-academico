import { UpdateAlunoTurmaDto } from '../../dto/update-aluno-turma.dto';

export class UpdateAlunoTurmaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateAlunoTurmaDto,
  ) {}
}
