import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { AlunoService } from './aluno.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
