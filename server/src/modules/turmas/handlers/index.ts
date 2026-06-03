export { CreateTurmaHandler } from './create-turma.handler';
export { GetTurmaByIdHandler } from './get-turma-by-id.handler';
export { ListTurmasHandler } from './list-turmas.handler';
export { RemoveTurmaHandler } from './remove-turma.handler';
export { UpdateTurmaHandler } from './update-turma.handler';

import { CreateTurmaHandler } from './create-turma.handler';
import { GetTurmaByIdHandler } from './get-turma-by-id.handler';
import { ListTurmasHandler } from './list-turmas.handler';
import { RemoveTurmaHandler } from './remove-turma.handler';
import { UpdateTurmaHandler } from './update-turma.handler';

export const turmasCommandHandlers = [
  CreateTurmaHandler,
  UpdateTurmaHandler,
  RemoveTurmaHandler,
];

export const turmasQueryHandlers = [GetTurmaByIdHandler, ListTurmasHandler];
