import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { TurmasService } from './turmas.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [TurmasService],
  exports: [TurmasService],
})
export class TurmasModule {}
