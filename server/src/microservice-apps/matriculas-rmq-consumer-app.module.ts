import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MatriculaRmqEventsController } from '../messaging/matricula-rmq-events.controller';
import { UsuarioRmqEventsController } from '../messaging/usuario-rmq-events.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [MatriculaRmqEventsController, UsuarioRmqEventsController],
})
export class MatriculasRmqConsumerAppModule {}
