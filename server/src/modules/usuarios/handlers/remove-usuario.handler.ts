import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsuariosService } from '../usuarios.service';
import { RemoveUsuarioCommand } from '../commands/impl/remove-usuario.command';

@CommandHandler(RemoveUsuarioCommand)
export class RemoveUsuarioHandler implements ICommandHandler<RemoveUsuarioCommand> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: RemoveUsuarioCommand) {
    return this.usuariosService.remove(command.id);
  }
}
