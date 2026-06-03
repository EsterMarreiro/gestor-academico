import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProfessorCommand } from '../commands/impl/remove-professor.command';
import { ProfessorService } from '../professor.service';

@CommandHandler(RemoveProfessorCommand)
export class RemoveProfessorHandler implements ICommandHandler<RemoveProfessorCommand> {
  constructor(private readonly professorService: ProfessorService) {}

  execute(command: RemoveProfessorCommand) {
    return this.professorService.remove(command.id);
  }
}
