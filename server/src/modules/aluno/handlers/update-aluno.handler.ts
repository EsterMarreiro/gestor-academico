import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAlunoCommand } from '../commands/impl/update-aluno.command';
import { AlunoService } from '../aluno.service';

@CommandHandler(UpdateAlunoCommand)
export class UpdateAlunoHandler implements ICommandHandler<UpdateAlunoCommand> {
  constructor(private readonly alunoService: AlunoService) {}

  execute(command: UpdateAlunoCommand) {
    return this.alunoService.update(command.id, command.dto);
  }
}
