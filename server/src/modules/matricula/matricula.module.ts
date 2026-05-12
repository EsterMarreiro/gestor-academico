import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { MatriculaService } from './matricula.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [MatriculaService],
  exports: [MatriculaService],
})
export class MatriculaModule {}
