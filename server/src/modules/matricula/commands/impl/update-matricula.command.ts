import { UpdateMatriculaDto } from '../../dto/update-matricula.dto';

export class UpdateMatriculaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateMatriculaDto,
  ) {}
}
