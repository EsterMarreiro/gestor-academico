import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfessorCommand } from '../commands/impl/create-professor.command';
import { ProfessorService } from '../professor.service';

@CommandHandler(CreateProfessorCommand)
export class CreateProfessorHandler implements ICommandHandler<CreateProfessorCommand> {
  constructor(private readonly professorService: ProfessorService) {}

  execute(command: CreateProfessorCommand) {
    return this.professorService.create(command.dto);
  }
}
