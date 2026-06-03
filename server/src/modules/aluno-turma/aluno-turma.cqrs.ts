export { CreateAlunoTurmaCommand } from './commands/impl/create-aluno-turma.command';
export { UpdateAlunoTurmaCommand } from './commands/impl/update-aluno-turma.command';
export { RemoveAlunoTurmaCommand } from './commands/impl/remove-aluno-turma.command';
export { GetAlunoTurmaByIdQuery } from './queries/impl/get-aluno-turma-by-id.query';
export { ListAlunosTurmaQuery } from './queries/impl/list-alunos-turma.query';
import { CreateAlunoTurmaHandler } from './handlers/create-aluno-turma.handler';
import { GetAlunoTurmaByIdHandler } from './handlers/get-aluno-turma-by-id.handler';
import { ListAlunosTurmaHandler } from './handlers/list-alunos-turma.handler';
import { RemoveAlunoTurmaHandler } from './handlers/remove-aluno-turma.handler';
import { UpdateAlunoTurmaHandler } from './handlers/update-aluno-turma.handler';

export const alunoTurmaCommandHandlers = [
  CreateAlunoTurmaHandler,
  UpdateAlunoTurmaHandler,
  RemoveAlunoTurmaHandler,
];

export const alunoTurmaQueryHandlers = [
  GetAlunoTurmaByIdHandler,
  ListAlunosTurmaHandler,
];
