import { UpdateCursosDto } from '../../dto/update-cursos.dto';

export class UpdateCursoCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCursosDto,
  ) {}
}
