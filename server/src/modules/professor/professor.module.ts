import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import {
  professorCommandHandlers,
  professorQueryHandlers,
} from './professor.cqrs';
import { ProfessorService } from './professor.service';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [
    ProfessorService,
    ...professorCommandHandlers,
    ...professorQueryHandlers,
  ],
  exports: [CqrsModule, ProfessorService],
})
export class ProfessorModule {}
