import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateMatriculaCommand } from '../commands/impl/create-matricula.command';
import { MatriculaCreatedEvent } from '../events/impl/matricula-created.event';
import { MatriculaWriteRepository } from '../repositories/matricula-write.repository';

@CommandHandler(CreateMatriculaCommand)
export class CreateMatriculaHandler implements ICommandHandler<CreateMatriculaCommand> {
  constructor(
    private readonly writeRepository: MatriculaWriteRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateMatriculaCommand) {
    const matricula = await this.writeRepository.create(command.dto);
    this.eventBus.publish(new MatriculaCreatedEvent(matricula));
    return matricula;
  }
}
