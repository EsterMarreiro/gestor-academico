import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { AulaService } from './aula.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [AulaService],
  exports: [AulaService],
})
export class AulaModule {}
