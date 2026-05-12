import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  USUARIO_CRIADO_EVENT,
  UsuarioCriadoPayload,
} from '../contracts/rmq.events';
import { RMQ_CLIENT_MATRICULA_EVENTS } from './rmq.constants';

@Injectable()
export class UsuarioEventsPublisher {
  private readonly logger = new Logger(UsuarioEventsPublisher.name);

  constructor(
    @Inject(RMQ_CLIENT_MATRICULA_EVENTS)
    private readonly client: ClientProxy,
  ) {}

  publishUsuarioCriado(usuario: {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
  }): void {
    const payload: UsuarioCriadoPayload = {
      usuarioId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
    };
    this.client.emit(USUARIO_CRIADO_EVENT, payload).subscribe({
      error: (err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${USUARIO_CRIADO_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
    });
  }
}
