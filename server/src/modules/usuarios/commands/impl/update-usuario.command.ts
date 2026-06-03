import { UpdateUsuarioDto } from '../../dto/update-usuario.dto';

export class UpdateUsuarioCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUsuarioDto,
  ) {}
}
