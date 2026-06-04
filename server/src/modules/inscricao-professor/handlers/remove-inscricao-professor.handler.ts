import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveInscricaoProfessorCommand } from '../commands/impl/remove-inscricao-professor.command';
import { InscricaoProfessorService } from '../inscricao-professor.service';

@CommandHandler(RemoveInscricaoProfessorCommand)
export class RemoveInscricaoProfessorHandler implements ICommandHandler<RemoveInscricaoProfessorCommand> {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  execute(command: RemoveInscricaoProfessorCommand) {
    return this.inscricaoProfessorService.remove(command.id);
  }
}
