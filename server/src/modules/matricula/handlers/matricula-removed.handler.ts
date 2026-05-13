import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatriculaEventsPublisher } from '../../../messaging/matricula-events.publisher';
import { MatriculaRemovedEvent } from '../events/impl/matricula-removed.event';

@EventsHandler(MatriculaRemovedEvent)
export class MatriculaRemovedHandler
  implements IEventHandler<MatriculaRemovedEvent>
{
  private readonly logger = new Logger(MatriculaRemovedHandler.name);

  constructor(
    private readonly matriculaEvents: MatriculaEventsPublisher,
  ) {}

  handle(event: MatriculaRemovedEvent) {
    this.matriculaEvents.publishMatriculaRemovida(event.matricula.id);
    this.logger.debug(
      `Matricula removida e evento publicado: ${JSON.stringify(event.matricula)}`,
    );
  }
}
