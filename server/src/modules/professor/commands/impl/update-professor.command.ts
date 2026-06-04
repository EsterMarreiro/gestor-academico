import { UpdateProfessorDto } from '../../dto/update-professor.dto';

export class UpdateProfessorCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateProfessorDto,
  ) {}
}
