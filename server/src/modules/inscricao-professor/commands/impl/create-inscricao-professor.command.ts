import { CreateInscricaoProfessorDto } from '../../dto/create-inscricao-professor.dto';

export class CreateInscricaoProfessorCommand {
  constructor(public readonly dto: CreateInscricaoProfessorDto) {}
}
