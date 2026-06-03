import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAlunoCommand } from '../commands/impl/remove-aluno.command';
import { AlunoService } from '../aluno.service';

@CommandHandler(RemoveAlunoCommand)
export class RemoveAlunoHandler implements ICommandHandler<RemoveAlunoCommand> {
  constructor(private readonly alunoService: AlunoService) {}

  execute(command: RemoveAlunoCommand) {
    return this.alunoService.remove(command.id);
  }
}
