import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { ProfessorService } from './professor.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [ProfessorService],
  exports: [ProfessorService],
})
export class ProfessorModule {}
