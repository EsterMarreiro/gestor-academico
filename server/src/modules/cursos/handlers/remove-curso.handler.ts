import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CursosService } from '../cursos.service';
import { RemoveCursoCommand } from '../commands/impl/remove-curso.command';

@CommandHandler(RemoveCursoCommand)
export class RemoveCursoHandler implements ICommandHandler<RemoveCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: RemoveCursoCommand) {
    return this.cursosService.remove(command.id);
  }
}
