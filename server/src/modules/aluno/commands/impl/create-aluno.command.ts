import { CreateAlunoDto } from '../../dto/create-aluno.dto';

export class CreateAlunoCommand {
  constructor(public readonly dto: CreateAlunoDto) {}
}
