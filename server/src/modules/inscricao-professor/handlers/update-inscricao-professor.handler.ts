import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateInscricaoProfessorCommand } from '../commands/impl/update-inscricao-professor.command';
import { InscricaoProfessorService } from '../inscricao-professor.service';

@CommandHandler(UpdateInscricaoProfessorCommand)
export class UpdateInscricaoProfessorHandler implements ICommandHandler<UpdateInscricaoProfessorCommand> {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  execute(command: UpdateInscricaoProfessorCommand) {
    return this.inscricaoProfessorService.update(command.id, command.dto);
  }
}
