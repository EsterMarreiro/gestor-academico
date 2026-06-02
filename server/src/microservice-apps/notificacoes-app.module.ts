import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificacoesModule } from '../notifications/notificacoes.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NotificacoesModule],
})
export class NotificacoesAppModule {}
