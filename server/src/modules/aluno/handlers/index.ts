export { CreateAlunoHandler } from './create-aluno.handler';
export { GetAlunoByIdHandler } from './get-aluno-by-id.handler';
export { ListAlunosHandler } from './list-alunos.handler';
export { RemoveAlunoHandler } from './remove-aluno.handler';
export { UpdateAlunoHandler } from './update-aluno.handler';

import { CreateAlunoHandler } from './create-aluno.handler';
import { GetAlunoByIdHandler } from './get-aluno-by-id.handler';
import { ListAlunosHandler } from './list-alunos.handler';
import { RemoveAlunoHandler } from './remove-aluno.handler';
import { UpdateAlunoHandler } from './update-aluno.handler';

export const alunoCommandHandlers = [
  CreateAlunoHandler,
  UpdateAlunoHandler,
  RemoveAlunoHandler,
];

export const alunoQueryHandlers = [GetAlunoByIdHandler, ListAlunosHandler];
