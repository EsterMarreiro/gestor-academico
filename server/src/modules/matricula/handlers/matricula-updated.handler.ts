import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MatriculaEventsPublisher } from '../../../messaging/matricula-events.publisher';
import { MatriculaUpdatedEvent } from '../events/impl/matricula-updated.event';

@EventsHandler(MatriculaUpdatedEvent)
export class MatriculaUpdatedHandler
  implements IEventHandler<MatriculaUpdatedEvent>
{
  private readonly logger = new Logger(MatriculaUpdatedHandler.name);

  constructor(
    private readonly matriculaEvents: MatriculaEventsPublisher,
  ) {}

  handle(event: MatriculaUpdatedEvent) {
    this.matriculaEvents.publishMatriculaAtualizada({
      id: event.matricula.id,
      alunoId: event.matricula.alunoId,
      cursoId: event.matricula.cursoId,
      status: event.matricula.status,
    });
    this.logger.debug(
      `Matricula atualizada e evento publicado: ${JSON.stringify(event.matricula)}`,
    );
  }
}
