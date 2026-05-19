import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMatriculaCommand } from '../commands/impl/update-matricula.command';
import { MatriculaUpdatedEvent } from '../events/impl/matricula-updated.event';
import { MatriculaReadRepository } from '../repositories/matricula-read.repository';
import { MatriculaWriteRepository } from '../repositories/matricula-write.repository';

@CommandHandler(UpdateMatriculaCommand)
export class UpdateMatriculaHandler implements ICommandHandler<UpdateMatriculaCommand> {
  constructor(
    private readonly readRepository: MatriculaReadRepository,
    private readonly writeRepository: MatriculaWriteRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateMatriculaCommand) {
    await this.readRepository.findOne(command.id);
    const matricula = await this.writeRepository.update(
      command.id,
      command.dto,
    );
    this.eventBus.publish(new MatriculaUpdatedEvent(matricula));
    return matricula;
  }
}
