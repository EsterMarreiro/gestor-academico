import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDisciplinaCommand } from '../commands/impl/create-disciplina.command';
import { DisciplinaService } from '../disciplina.service';

@CommandHandler(CreateDisciplinaCommand)
export class CreateDisciplinaHandler implements ICommandHandler<CreateDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: CreateDisciplinaCommand) {
    return this.disciplinaService.create(command.dto);
  }
}
