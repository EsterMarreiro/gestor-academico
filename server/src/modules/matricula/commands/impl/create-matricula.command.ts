import { CreateMatriculaDto } from '../../dto/create-matricula.dto';

export class CreateMatriculaCommand {
  constructor(public readonly dto: CreateMatriculaDto) {}
}
