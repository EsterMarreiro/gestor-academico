import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInscricaoProfessorCommand } from '../commands/impl/create-inscricao-professor.command';
import { InscricaoProfessorService } from '../inscricao-professor.service';

@CommandHandler(CreateInscricaoProfessorCommand)
export class CreateInscricaoProfessorHandler implements ICommandHandler<CreateInscricaoProfessorCommand> {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  execute(command: CreateInscricaoProfessorCommand) {
    return this.inscricaoProfessorService.create(command.dto);
  }
}
