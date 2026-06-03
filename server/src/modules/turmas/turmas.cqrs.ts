export { CreateTurmaCommand } from './commands/impl/create-turma.command';
export { UpdateTurmaCommand } from './commands/impl/update-turma.command';
export { RemoveTurmaCommand } from './commands/impl/remove-turma.command';
export { GetTurmaByIdQuery } from './queries/impl/get-turma-by-id.query';
export { ListTurmasQuery } from './queries/impl/list-turmas.query';
import { CreateTurmaHandler } from './handlers/create-turma.handler';
import { GetTurmaByIdHandler } from './handlers/get-turma-by-id.handler';
import { ListTurmasHandler } from './handlers/list-turmas.handler';
import { RemoveTurmaHandler } from './handlers/remove-turma.handler';
import { UpdateTurmaHandler } from './handlers/update-turma.handler';

export const turmasCommandHandlers = [
  CreateTurmaHandler,
  UpdateTurmaHandler,
  RemoveTurmaHandler,
];

export const turmasQueryHandlers = [GetTurmaByIdHandler, ListTurmasHandler];
