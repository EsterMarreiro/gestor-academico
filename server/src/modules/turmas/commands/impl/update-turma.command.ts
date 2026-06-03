import { UpdateTurmaDto } from '../../dto/update-turma.dto';

export class UpdateTurmaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateTurmaDto,
  ) {}
}
