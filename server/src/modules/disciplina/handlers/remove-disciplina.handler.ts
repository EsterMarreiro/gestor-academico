import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveDisciplinaCommand } from '../commands/impl/remove-disciplina.command';
import { DisciplinaService } from '../disciplina.service';

@CommandHandler(RemoveDisciplinaCommand)
export class RemoveDisciplinaHandler implements ICommandHandler<RemoveDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: RemoveDisciplinaCommand) {
    return this.disciplinaService.remove(command.id);
  }
}
