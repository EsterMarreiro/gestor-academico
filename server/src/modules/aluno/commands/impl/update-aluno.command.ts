import { UpdateAlunoDto } from '../../dto/update-aluno.dto';

export class UpdateAlunoCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateAlunoDto,
  ) {}
}
