import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { DisciplinaService } from './disciplina.service';
import {
  disciplinaCommandHandlers,
  disciplinaQueryHandlers,
} from './disciplina.cqrs';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [
    DisciplinaService,
    ...disciplinaCommandHandlers,
    ...disciplinaQueryHandlers,
  ],
  exports: [CqrsModule, DisciplinaService],
})
export class DisciplinaModule {}
