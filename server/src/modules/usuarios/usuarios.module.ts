import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [MessagingRmqModule],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
