import { UpdateCursoDto } from '../../dto/update-curso.dto';

export class UpdateCursoCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCursoDto,
  ) {}
}
