import { UpdateDisciplinaDto } from '../../dto/update-disciplina.dto';

export class UpdateDisciplinaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDisciplinaDto,
  ) {}
}
