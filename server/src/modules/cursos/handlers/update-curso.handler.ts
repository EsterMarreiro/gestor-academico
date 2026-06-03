import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CursosService } from '../cursos.service';
import { UpdateCursoCommand } from '../commands/impl/update-curso.command';

@CommandHandler(UpdateCursoCommand)
export class UpdateCursoHandler implements ICommandHandler<UpdateCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: UpdateCursoCommand) {
    return this.cursosService.update(command.id, command.dto);
  }
}
