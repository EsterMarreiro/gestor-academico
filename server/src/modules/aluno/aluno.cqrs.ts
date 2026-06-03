export { CreateAlunoCommand } from './commands/impl/create-aluno.command';
export { UpdateAlunoCommand } from './commands/impl/update-aluno.command';
export { RemoveAlunoCommand } from './commands/impl/remove-aluno.command';
export { GetAlunoByIdQuery } from './queries/impl/get-aluno-by-id.query';
export { ListAlunosQuery } from './queries/impl/list-alunos.query';
import { CreateAlunoHandler } from './handlers/create-aluno.handler';
import { GetAlunoByIdHandler } from './handlers/get-aluno-by-id.handler';
import { ListAlunosHandler } from './handlers/list-alunos.handler';
import { RemoveAlunoHandler } from './handlers/remove-aluno.handler';
import { UpdateAlunoHandler } from './handlers/update-aluno.handler';

export const alunoCommandHandlers = [
  CreateAlunoHandler,
  UpdateAlunoHandler,
  RemoveAlunoHandler,
];

export const alunoQueryHandlers = [GetAlunoByIdHandler, ListAlunosHandler];
