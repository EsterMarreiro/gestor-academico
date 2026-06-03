import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAlunoTurmaCommand } from '../commands/impl/update-aluno-turma.command';
import { AlunoTurmaService } from '../aluno-turma.service';

@CommandHandler(UpdateAlunoTurmaCommand)
export class UpdateAlunoTurmaHandler implements ICommandHandler<UpdateAlunoTurmaCommand> {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  execute(command: UpdateAlunoTurmaCommand) {
    return this.alunoTurmaService.update(command.id, command.dto);
  }
}
