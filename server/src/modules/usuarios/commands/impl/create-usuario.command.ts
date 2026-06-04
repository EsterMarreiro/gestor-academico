import { CreateUsuarioDto } from '../../dto/create-usuario.dto';

export class CreateUsuarioCommand {
  constructor(public readonly dto: CreateUsuarioDto) {}
}
