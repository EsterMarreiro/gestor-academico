import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ALUNO_ATUALIZADO_EVENT,
  ALUNO_CRIADO_EVENT,
  ALUNO_REMOVIDO_EVENT,
  CURSO_ATUALIZADO_EVENT,
  CURSO_CRIADO_EVENT,
  CURSO_REMOVIDO_EVENT,
  DISCIPLINA_ATUALIZADA_EVENT,
  DISCIPLINA_CRIADA_EVENT,
  DISCIPLINA_REMOVIDA_EVENT,
  PROFESSOR_ATUALIZADO_EVENT,
  PROFESSOR_CRIADO_EVENT,
  PROFESSOR_REMOVIDO_EVENT,
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

  @EventPattern(ALUNO_CRIADO_EVENT)
  handleAlunoCriado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Aluno criado: id=${data['alunoId']} usuario=${data['usuarioId']}`,
    );
  }

  @EventPattern(ALUNO_ATUALIZADO_EVENT)
  handleAlunoAtualizado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Aluno atualizado: id=${data['alunoId']}`);
  }

  @EventPattern(ALUNO_REMOVIDO_EVENT)
  handleAlunoRemovido(@Payload() data: Record<string, unknown>): void {
    this.logger.log(`[mensageria] Aluno removido: id=${data['alunoId']}`);
  }

  @EventPattern(PROFESSOR_CRIADO_EVENT)
  handleProfessorCriado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Professor criado: id=${data['professorId']} usuario=${data['usuarioId']}`,
    );
  }

  @EventPattern(PROFESSOR_ATUALIZADO_EVENT)
  handleProfessorAtualizado(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Professor atualizado: id=${data['professorId']}`,
    );
  }

  @EventPattern(PROFESSOR_REMOVIDO_EVENT)
  handleProfessorRemovido(@Payload() data: Record<string, unknown>): void {
    this.logger.log(
      `[mensageria] Professor removido: id=${data['professorId']}`,
    );
  }
}
