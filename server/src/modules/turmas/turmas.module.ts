import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TurmasService } from './turmas.service';
import { turmasCommandHandlers, turmasQueryHandlers } from './turmas.cqrs';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [TurmasService, ...turmasCommandHandlers, ...turmasQueryHandlers],
  exports: [CqrsModule, TurmasService],
})
export class TurmasModule {}
