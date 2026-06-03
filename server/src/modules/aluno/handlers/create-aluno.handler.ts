import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAlunoCommand } from '../commands/impl/create-aluno.command';
import { AlunoService } from '../aluno.service';

@CommandHandler(CreateAlunoCommand)
export class CreateAlunoHandler implements ICommandHandler<CreateAlunoCommand> {
  constructor(private readonly alunoService: AlunoService) {}

  execute(command: CreateAlunoCommand) {
    return this.alunoService.create(command.dto);
  }
}
