import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateMatriculaHandler } from './handlers/create-matricula.handler';
import { GetMatriculaByIdHandler } from './handlers/get-matricula-by-id.handler';
import { ListMatriculasHandler } from './handlers/list-matriculas.handler';
import { MatriculaCreatedHandler } from './handlers/matricula-created.handler';
import { MatriculaReadRepository } from './repositories/matricula-read.repository';
import { MatriculaRemovedHandler } from './handlers/matricula-removed.handler';
import { MatriculaUpdatedHandler } from './handlers/matricula-updated.handler';
import { MatriculaWriteRepository } from './repositories/matricula-write.repository';
import { RemoveMatriculaHandler } from './handlers/remove-matricula.handler';
import { UpdateMatriculaHandler } from './handlers/update-matricula.handler';

const commandHandlers = [
  CreateMatriculaHandler,
  UpdateMatriculaHandler,
  RemoveMatriculaHandler,
];

const queryHandlers = [GetMatriculaByIdHandler, ListMatriculasHandler];

const eventHandlers = [
  MatriculaCreatedHandler,
  MatriculaUpdatedHandler,
  MatriculaRemovedHandler,
];

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [
    MatriculaReadRepository,
    MatriculaWriteRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [CqrsModule, MatriculaReadRepository, MatriculaWriteRepository],
})
export class MatriculaModule {}
