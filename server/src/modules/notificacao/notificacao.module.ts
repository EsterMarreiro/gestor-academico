import { Module } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoGateway } from './notificacao.gateway';

@Module({
  controllers: [NotificacaoController],
  providers: [NotificacaoService, NotificacaoGateway],
  exports: [NotificacaoService, NotificacaoGateway],
})
export class NotificacaoModule {}
