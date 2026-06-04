import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfessorCommand } from '../commands/impl/update-professor.command';
import { ProfessorService } from '../professor.service';

@CommandHandler(UpdateProfessorCommand)
export class UpdateProfessorHandler implements ICommandHandler<UpdateProfessorCommand> {
  constructor(private readonly professorService: ProfessorService) {}

  execute(command: UpdateProfessorCommand) {
    return this.professorService.update(command.id, command.dto);
  }
}
