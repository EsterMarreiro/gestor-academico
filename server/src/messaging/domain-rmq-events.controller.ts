import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  AULA_ATUALIZADA_EVENT,
  AULA_CRIADA_EVENT,
  AULA_REMOVIDA_EVENT,
  CURSO_ATUALIZADO_EVENT,
  CURSO_CRIADO_EVENT,
  CURSO_REMOVIDO_EVENT,
  DISCIPLINA_ATUALIZADA_EVENT,
  DISCIPLINA_CRIADA_EVENT,
  DISCIPLINA_REMOVIDA_EVENT,
  TURMA_ATUALIZADA_EVENT,
  TURMA_CRIADA_EVENT,
  TURMA_REMOVIDA_EVENT,
} from '../contracts/rmq.events';

@Controller()
export class DomainRmqEventsController {
  private readonly logger = new Logger(DomainRmqEventsController.name);

  @EventPattern(CURSO_CRIADO_EVENT)
  handleCursoCriado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Curso criado: id=${data['cursoId']} nome=${data['nome']}`,
    );
  }

  @EventPattern(CURSO_ATUALIZADO_EVENT)
  handleCursoAtualizado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Curso atualizado: id=${data['cursoId']}`);
  }

  @EventPattern(CURSO_REMOVIDO_EVENT)
  handleCursoRemovido(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Curso removido: id=${data['cursoId']}`);
  }

  @EventPattern(DISCIPLINA_CRIADA_EVENT)
  handleDisciplinaCriada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Disciplina criada: id=${data['disciplinaId']} curso=${data['cursoId']}`,
    );
  }

  @EventPattern(DISCIPLINA_ATUALIZADA_EVENT)
  handleDisciplinaAtualizada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Disciplina atualizada: id=${data['disciplinaId']}`,
    );
  }

  @EventPattern(DISCIPLINA_REMOVIDA_EVENT)
  handleDisciplinaRemovida(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Disciplina removida: id=${data['disciplinaId']}`,
    );
  }

  @EventPattern(TURMA_CRIADA_EVENT)
  handleTurmaCriada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Turma criada: id=${data['turmaId']} codigo=${data['codigo']}`,
    );
  }

  @EventPattern(TURMA_ATUALIZADA_EVENT)
  handleTurmaAtualizada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Turma atualizada: id=${data['turmaId']}`);
  }

  @EventPattern(TURMA_REMOVIDA_EVENT)
  handleTurmaRemovida(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Turma removida: id=${data['turmaId']}`);
  }

  @EventPattern(AULA_CRIADA_EVENT)
  handleAulaCriada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Aula criada: id=${data['aulaId']} turma=${data['turmaId']}`,
    );
  }

  @EventPattern(AULA_ATUALIZADA_EVENT)
  handleAulaAtualizada(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Aula atualizada: id=${data['aulaId']}`);
  }

  @EventPattern(AULA_REMOVIDA_EVENT)
  handleAulaRemovida(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Aula removida: id=${data['aulaId']}`);
  }
}
