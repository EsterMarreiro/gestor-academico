import { UpdateInscricaoProfessorDto } from '../../dto/update-inscricao-professor.dto';

export class UpdateInscricaoProfessorCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateInscricaoProfessorDto,
  ) {}
}
