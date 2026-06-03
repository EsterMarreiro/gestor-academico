import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlunoTurmaCommand } from '../commands/impl/create-aluno-turma.command';
import { AlunoTurmaService } from '../aluno-turma.service';

@CommandHandler(CreateAlunoTurmaCommand)
export class CreateAlunoTurmaHandler implements ICommandHandler<CreateAlunoTurmaCommand> {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  execute(command: CreateAlunoTurmaCommand) {
    return this.alunoTurmaService.create(command.dto);
  }
}
