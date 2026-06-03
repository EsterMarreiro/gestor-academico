import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsuariosService } from '../usuarios.service';
import { CreateUsuarioCommand } from '../commands/impl/create-usuario.command';

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler implements ICommandHandler<CreateUsuarioCommand> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: CreateUsuarioCommand) {
    return this.usuariosService.create(command.dto);
  }
}
