import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MATRICULA_ATUALIZADA_EVENT,
  MATRICULA_CRIADA_EVENT,
  MATRICULA_REMOVIDA_EVENT,
  MatriculaCriadaPayload,
} from '../contracts/rmq.events';
import { RMQ_CLIENT_MATRICULA_EVENTS } from './rmq.constants';

@Injectable()
export class MatriculaEventsPublisher {
  private readonly logger = new Logger(MatriculaEventsPublisher.name);

  constructor(
    @Inject(RMQ_CLIENT_MATRICULA_EVENTS)
    private readonly client: ClientProxy,
  ) {}

  publishMatriculaCriada(matricula: {
    id: number;
    alunoId: number;
    cursoId: number;
    status: string;
  }): void {
    const payload: MatriculaCriadaPayload = {
      matriculaId: matricula.id,
      alunoId: matricula.alunoId,
      cursoId: matricula.cursoId,
      status: matricula.status,
    };
    this.client.emit(MATRICULA_CRIADA_EVENT, payload).subscribe({
      error: (err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${MATRICULA_CRIADA_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
    });
  }

  publishMatriculaAtualizada(matricula: {
    id: number;
    alunoId: number;
    cursoId: number;
    status: string;
  }): void {
    this.client
      .emit(MATRICULA_ATUALIZADA_EVENT, {
        matriculaId: matricula.id,
        alunoId: matricula.alunoId,
        cursoId: matricula.cursoId,
        status: matricula.status,
      })
      .subscribe({
        error: (err: unknown) =>
          this.logger.warn(
            `Falha ao publicar ${MATRICULA_ATUALIZADA_EVENT}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          ),
      });
  }

  publishMatriculaRemovida(matriculaId: number): void {
    this.client.emit(MATRICULA_REMOVIDA_EVENT, { matriculaId }).subscribe({
      error: (err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${MATRICULA_REMOVIDA_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
    });
  }
}
