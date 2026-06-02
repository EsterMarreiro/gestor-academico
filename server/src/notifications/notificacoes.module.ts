import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../messaging/messaging-rmq.module';
import { MatriculaCriadaConsumer } from './matricula-criada.consumer';
import { NotificacoesService } from './notificacoes.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [NotificacoesService, MatriculaCriadaConsumer],
})
export class NotificacoesModule {}
