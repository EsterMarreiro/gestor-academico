import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CursosService } from './cursos.service';
import { cursosCommandHandlers, cursosQueryHandlers } from './cursos.cqrs';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [CursosService, ...cursosCommandHandlers, ...cursosQueryHandlers],
  exports: [CursosService],
})
export class CursosModule {}
