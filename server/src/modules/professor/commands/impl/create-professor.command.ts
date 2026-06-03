import { CreateProfessorDto } from '../../dto/create-professor.dto';

export class CreateProfessorCommand {
  constructor(public readonly dto: CreateProfessorDto) {}
}
