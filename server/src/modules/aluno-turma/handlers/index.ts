export { CreateAlunoTurmaHandler } from './create-aluno-turma.handler';
export { GetAlunoTurmaByIdHandler } from './get-aluno-turma-by-id.handler';
export { ListAlunosTurmaHandler } from './list-alunos-turma.handler';
export { RemoveAlunoTurmaHandler } from './remove-aluno-turma.handler';
export { UpdateAlunoTurmaHandler } from './update-aluno-turma.handler';

import { CreateAlunoTurmaHandler } from './create-aluno-turma.handler';
import { GetAlunoTurmaByIdHandler } from './get-aluno-turma-by-id.handler';
import { ListAlunosTurmaHandler } from './list-alunos-turma.handler';
import { RemoveAlunoTurmaHandler } from './remove-aluno-turma.handler';
import { UpdateAlunoTurmaHandler } from './update-aluno-turma.handler';

export const alunoTurmaCommandHandlers = [
  CreateAlunoTurmaHandler,
  UpdateAlunoTurmaHandler,
  RemoveAlunoTurmaHandler,
];

export const alunoTurmaQueryHandlers = [
  GetAlunoTurmaByIdHandler,
  ListAlunosTurmaHandler,
];
