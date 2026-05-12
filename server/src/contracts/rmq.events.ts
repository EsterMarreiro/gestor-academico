/** Padrão de evento (routing) para consumidores RabbitMQ no Nest. */
export const MATRICULA_CRIADA_EVENT = 'matricula.criada' as const;

export type MatriculaCriadaPayload = {
  matriculaId: number;
  alunoId: number;
  cursoId: number;
  status: string;
};

/** Sem dados sensíveis (nunca enviar senha ou CPF no evento). */
export const USUARIO_CRIADO_EVENT = 'usuario.criado' as const;

export type UsuarioCriadoPayload = {
  usuarioId: number;
  nome: string;
  email: string;
  isAdmin: boolean;
};
