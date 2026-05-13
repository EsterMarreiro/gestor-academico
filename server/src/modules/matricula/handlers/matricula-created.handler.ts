import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatriculaEventsPublisher } from '../../../messaging/matricula-events.publisher';
import { MatriculaCreatedEvent } from '../events/impl/matricula-created.event';

@EventsHandler(MatriculaCreatedEvent)
export class MatriculaCreatedHandler
  implements IEventHandler<MatriculaCreatedEvent>
{
  private readonly logger = new Logger(MatriculaCreatedHandler.name);

  constructor(
    private readonly matriculaEvents: MatriculaEventsPublisher,
  ) {}

  handle(event: MatriculaCreatedEvent) {
    this.matriculaEvents.publishMatriculaCriada({
      id: event.matricula.id,
      alunoId: event.matricula.alunoId,
      cursoId: event.matricula.cursoId,
      status: event.matricula.status,
    });
    this.logger.debug(
      `Matricula criada e evento publicado: ${JSON.stringify(event.matricula)}`,
    );
  }
}
