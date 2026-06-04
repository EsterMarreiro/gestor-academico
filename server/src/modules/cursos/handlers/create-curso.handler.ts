import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CursosService } from '../cursos.service';
import { CreateCursoCommand } from '../commands/impl/create-curso.command';

@CommandHandler(CreateCursoCommand)
export class CreateCursoHandler implements ICommandHandler<CreateCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: CreateCursoCommand) {
    return this.cursosService.create(command.dto);
  }
}
