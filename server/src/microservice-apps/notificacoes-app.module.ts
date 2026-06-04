import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from '../observability/observability.module';
import { ResilienceModule } from '../resilience/resilience.module';
import { NotificacoesModule } from '../notifications/notificacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObservabilityModule,
    ResilienceModule,
    NotificacoesModule,
  ],
})
export class NotificacoesAppModule {}
