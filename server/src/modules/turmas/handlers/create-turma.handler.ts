import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTurmaCommand } from '../commands/impl/create-turma.command';
import { TurmasService } from '../turmas.service';

@CommandHandler(CreateTurmaCommand)
export class CreateTurmaHandler implements ICommandHandler<CreateTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: CreateTurmaCommand) {
    return this.turmasService.create(command.dto);
  }
}
