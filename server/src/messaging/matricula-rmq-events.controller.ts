import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  MATRICULA_ATUALIZADA_EVENT,
  MATRICULA_CRIADA_EVENT,
  MATRICULA_REMOVIDA_EVENT,
  type MatriculaCriadaPayload,
} from '../contracts/rmq.events';

@Controller()
export class MatriculaRmqEventsController {
  private readonly logger = new Logger(MatriculaRmqEventsController.name);

  @EventPattern(MATRICULA_CRIADA_EVENT)
  handleMatriculaCriada(@Payload() data: MatriculaCriadaPayload): void {
    this.logger.log(
      `[mensageria] Matrícula criada: id=${data.matriculaId} aluno=${data.alunoId} curso=${data.cursoId} status=${data.status}`,
    );
  }

  @EventPattern(MATRICULA_ATUALIZADA_EVENT)
  handleMatriculaAtualizada(@Payload() data: MatriculaCriadaPayload): void {
    this.logger.log(
      `[mensageria] Matrícula atualizada: id=${data.matriculaId} status=${data.status}`,
    );
  }

  @EventPattern(MATRICULA_REMOVIDA_EVENT)
  handleMatriculaRemovida(
    @Payload() data: { matriculaId: number },
  ): void {
    this.logger.log(
      `[mensageria] Matrícula removida: id=${data.matriculaId}`,
    );
  }
}
