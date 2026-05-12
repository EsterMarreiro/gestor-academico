import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  USUARIO_ATUALIZADO_EVENT,
  USUARIO_CRIADO_EVENT,
  USUARIO_REMOVIDO_EVENT,
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

  @EventPattern(USUARIO_ATUALIZADO_EVENT)
  handleUsuarioAtualizado(@Payload() data: UsuarioCriadoPayload): void {
    this.logger.log(
      `[mensageria] Utilizador atualizado: id=${data.usuarioId} email=${data.email}`,
    );
  }

  @EventPattern(USUARIO_REMOVIDO_EVENT)
  handleUsuarioRemovido(@Payload() data: { usuarioId: number }): void {
    this.logger.log(
      `[mensageria] Utilizador removido: id=${data.usuarioId}`,
    );
  }
}
