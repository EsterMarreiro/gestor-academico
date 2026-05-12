import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  USUARIO_CRIADO_EVENT,
  type UsuarioCriadoPayload,
} from '../contracts/rmq.events';

@Controller()
export class UsuarioRmqEventsController {
  private readonly logger = new Logger(UsuarioRmqEventsController.name);

  @EventPattern(USUARIO_CRIADO_EVENT)
  handleUsuarioCriado(@Payload() data: UsuarioCriadoPayload): void {
    this.logger.log(
      `[mensageria] Utilizador criado: id=${data.usuarioId} email=${data.email} admin=${data.isAdmin}`,
    );
  }
}
