import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CursosService } from './cursos.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
