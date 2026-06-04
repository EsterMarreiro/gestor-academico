import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveTurmaCommand } from '../commands/impl/remove-turma.command';
import { TurmasService } from '../turmas.service';

@CommandHandler(RemoveTurmaCommand)
export class RemoveTurmaHandler implements ICommandHandler<RemoveTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: RemoveTurmaCommand) {
    return this.turmasService.remove(command.id);
  }
}
