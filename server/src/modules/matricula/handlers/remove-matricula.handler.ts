import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMatriculaCommand } from '../commands/impl/remove-matricula.command';
import { MatriculaRemovedEvent } from '../events/impl/matricula-removed.event';
import { MatriculaReadRepository } from '../repositories/matricula-read.repository';
import { MatriculaWriteRepository } from '../repositories/matricula-write.repository';

@CommandHandler(RemoveMatriculaCommand)
export class RemoveMatriculaHandler implements ICommandHandler<RemoveMatriculaCommand> {
  constructor(
    private readonly readRepository: MatriculaReadRepository,
    private readonly writeRepository: MatriculaWriteRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveMatriculaCommand) {
    await this.readRepository.findOne(command.id);
    const matricula = await this.writeRepository.remove(command.id);
    this.eventBus.publish(new MatriculaRemovedEvent(matricula));
    return matricula;
  }
}
