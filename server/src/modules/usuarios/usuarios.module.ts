import { Module } from '@nestjs/common';
import { MessagingRmqModule } from '../../messaging/messaging-rmq.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UsuariosService } from './usuarios.service';
import {
  usuariosCommandHandlers,
  usuariosQueryHandlers,
} from './usuarios.cqrs';

@Module({
  imports: [CqrsModule, MessagingRmqModule],
  providers: [
    UsuariosService,
    ...usuariosCommandHandlers,
    ...usuariosQueryHandlers,
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
