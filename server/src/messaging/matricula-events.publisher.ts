import { Injectable, Logger } from '@nestjs/common';
import {
  MATRICULA_ATUALIZADA_EVENT,
  MATRICULA_CRIADA_EVENT,
  MATRICULA_REMOVIDA_EVENT,
  MatriculaCriadaPayload,
} from '../contracts/rmq.events';
import { RMQ_EVENTS_EXCHANGE, RMQ_EVENTS_EXCHANGE_TYPE } from './rmq.constants';
import { RabbitMqConnectionService } from './rabbitmq-connection.service';

@Injectable()
export class MatriculaEventsPublisher {
  private readonly logger = new Logger(MatriculaEventsPublisher.name);

  constructor(private readonly rabbitMq: RabbitMqConnectionService) {}

  async publishMatriculaCriada(matricula: {
    id: number;
    alunoId: number;
    cursoId: number;
    status: string;
  }): Promise<void> {
    const payload: MatriculaCriadaPayload = {
      matriculaId: matricula.id,
      alunoId: matricula.alunoId,
      cursoId: matricula.cursoId,
      status: matricula.status,
    };
    await this.rabbitMq
      .publish(
        RMQ_EVENTS_EXCHANGE,
        MATRICULA_CRIADA_EVENT,
        payload,
        RMQ_EVENTS_EXCHANGE_TYPE,
      )
      .catch((err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${MATRICULA_CRIADA_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
      );
  }

  async publishMatriculaAtualizada(matricula: {
    id: number;
    alunoId: number;
    cursoId: number;
    status: string;
  }): Promise<void> {
    await this.rabbitMq
      .publish(
        RMQ_EVENTS_EXCHANGE,
        MATRICULA_ATUALIZADA_EVENT,
        {
          matriculaId: matricula.id,
          alunoId: matricula.alunoId,
          cursoId: matricula.cursoId,
          status: matricula.status,
        },
        RMQ_EVENTS_EXCHANGE_TYPE,
      )
      .catch((err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${MATRICULA_ATUALIZADA_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
      );
  }

  async publishMatriculaRemovida(matriculaId: number): Promise<void> {
    await this.rabbitMq
      .publish(
        RMQ_EVENTS_EXCHANGE,
        MATRICULA_REMOVIDA_EVENT,
        { matriculaId },
        RMQ_EVENTS_EXCHANGE_TYPE,
      )
      .catch((err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${MATRICULA_REMOVIDA_EVENT}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
      );
  }
}
