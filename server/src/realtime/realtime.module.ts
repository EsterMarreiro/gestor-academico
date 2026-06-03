import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../messaging/messaging-rmq.module';
import { CacheConfigurationModule } from '../shared/cache/cache.module';
import { MatriculaRealtimeConsumer } from './matricula-realtime.consumer';
import { RealtimeEventsGateway } from './realtime-events.gateway';

@Module({
  imports: [MessagingRmqModule, CacheConfigurationModule],
  providers: [RealtimeEventsGateway, MatriculaRealtimeConsumer],
  exports: [RealtimeEventsGateway],
})
export class RealtimeModule {}
