import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDisciplinaCommand } from '../commands/impl/update-disciplina.command';
import { DisciplinaService } from '../disciplina.service';

@CommandHandler(UpdateDisciplinaCommand)
export class UpdateDisciplinaHandler implements ICommandHandler<UpdateDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: UpdateDisciplinaCommand) {
    return this.disciplinaService.update(command.id, command.dto);
  }
}
