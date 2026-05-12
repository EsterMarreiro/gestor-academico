import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  USUARIO_ATUALIZADO_EVENT,
  USUARIO_CRIADO_EVENT,
  USUARIO_REMOVIDO_EVENT,
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

  publishUsuarioAtualizado(usuario: {
    id: number;
    nome: string;
    email: string;
    isAdmin: boolean;
  }): void {
    this.client
      .emit(USUARIO_ATUALIZADO_EVENT, {
        usuarioId: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
      })
      .subscribe({
        error: (err: unknown) =>
          this.logger.warn(
            `Falha ao publicar ${USUARIO_ATUALIZADO_EVENT}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          ),
      });
  }

  publishUsuarioRemovido(usuarioId: number): void {
    this.client.emit(USUARIO_REMOVIDO_EVENT, { usuarioId }).subscribe({
      error: (err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${USUARIO_REMOVIDO_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
    });
  }
}
