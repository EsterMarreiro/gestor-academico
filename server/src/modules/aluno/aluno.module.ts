import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { alunoCommandHandlers, alunoQueryHandlers } from './aluno.cqrs';
import { AlunoService } from './aluno.service';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [AlunoService, ...alunoCommandHandlers, ...alunoQueryHandlers],
  exports: [CqrsModule, AlunoService],
})
export class AlunoModule {}
