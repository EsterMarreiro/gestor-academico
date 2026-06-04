import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CqrsModule } from '@nestjs/cqrs';
import {
  matriculaCommandHandlers,
  matriculaEventHandlers,
  matriculaQueryHandlers,
} from './handlers';
import { MatriculaReadRepository } from './repositories/matricula-read.repository';
import { MatriculaWriteRepository } from './repositories/matricula-write.repository';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [
    MatriculaReadRepository,
    MatriculaWriteRepository,
    ...matriculaCommandHandlers,
    ...matriculaQueryHandlers,
    ...matriculaEventHandlers,
  ],
  exports: [CqrsModule, MatriculaReadRepository, MatriculaWriteRepository],
})
export class MatriculaModule {}
