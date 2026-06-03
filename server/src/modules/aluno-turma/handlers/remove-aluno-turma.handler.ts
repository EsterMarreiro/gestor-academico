import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAlunoTurmaCommand } from '../commands/impl/remove-aluno-turma.command';
import { AlunoTurmaService } from '../aluno-turma.service';

@CommandHandler(RemoveAlunoTurmaCommand)
export class RemoveAlunoTurmaHandler implements ICommandHandler<RemoveAlunoTurmaCommand> {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  execute(command: RemoveAlunoTurmaCommand) {
    return this.alunoTurmaService.remove(command.id);
  }
}
