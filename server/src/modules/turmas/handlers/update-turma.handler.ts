import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTurmaCommand } from '../commands/impl/update-turma.command';
import { TurmasService } from '../turmas.service';

@CommandHandler(UpdateTurmaCommand)
export class UpdateTurmaHandler implements ICommandHandler<UpdateTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: UpdateTurmaCommand) {
    return this.turmasService.update(command.id, command.dto);
  }
}
