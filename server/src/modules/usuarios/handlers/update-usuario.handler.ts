import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsuariosService } from '../usuarios.service';
import { UpdateUsuarioCommand } from '../commands/impl/update-usuario.command';

@CommandHandler(UpdateUsuarioCommand)
export class UpdateUsuarioHandler implements ICommandHandler<UpdateUsuarioCommand> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: UpdateUsuarioCommand) {
    return this.usuariosService.update(command.id, command.dto);
  }
}
