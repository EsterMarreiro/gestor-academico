import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  MATRICULA_CRIADA_EVENT,
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
}
