/** Padrão de evento (routing) para consumidores RabbitMQ no Nest. */
export const MATRICULA_CRIADA_EVENT = 'matricula.criada' as const;

export type MatriculaCriadaPayload = {
  matriculaId: number;
  alunoId: number;
  cursoId: number;
  status: string;
};

export const MATRICULA_ATUALIZADA_EVENT = 'matricula.atualizada' as const;
export const MATRICULA_REMOVIDA_EVENT = 'matricula.removida' as const;

/** Sem dados sensíveis nos eventos de utilizador (nunca senha nem CPF). */
export const USUARIO_CRIADO_EVENT = 'usuario.criado' as const;

export type UsuarioCriadoPayload = {
  usuarioId: number;
  nome: string;
  email: string;
  isAdmin: boolean;
};

export const USUARIO_ATUALIZADO_EVENT = 'usuario.atualizado' as const;
export const USUARIO_REMOVIDO_EVENT = 'usuario.removido' as const;

export const CURSO_CRIADO_EVENT = 'curso.criado' as const;
export const CURSO_ATUALIZADO_EVENT = 'curso.atualizado' as const;
export const CURSO_REMOVIDO_EVENT = 'curso.removido' as const;

export const DISCIPLINA_CRIADA_EVENT = 'disciplina.criada' as const;
export const DISCIPLINA_ATUALIZADA_EVENT = 'disciplina.atualizada' as const;
export const DISCIPLINA_REMOVIDA_EVENT = 'disciplina.removida' as const;

export const TURMA_CRIADA_EVENT = 'turma.criada' as const;
export const TURMA_ATUALIZADA_EVENT = 'turma.atualizada' as const;
export const TURMA_REMOVIDA_EVENT = 'turma.removida' as const;

export const AULA_CRIADA_EVENT = 'aula.criada' as const;
export const AULA_ATUALIZADA_EVENT = 'aula.atualizada' as const;
export const AULA_REMOVIDA_EVENT = 'aula.removida' as const;

export const ALUNO_CRIADO_EVENT = 'aluno.criado' as const;
export const ALUNO_ATUALIZADO_EVENT = 'aluno.atualizado' as const;
export const ALUNO_REMOVIDO_EVENT = 'aluno.removido' as const;

export const PROFESSOR_CRIADO_EVENT = 'professor.criado' as const;
export const PROFESSOR_ATUALIZADO_EVENT = 'professor.atualizado' as const;
export const PROFESSOR_REMOVIDO_EVENT = 'professor.removido' as const;
