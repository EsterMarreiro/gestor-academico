export { CreateDisciplinaCommand } from './commands/impl/create-disciplina.command';
export { UpdateDisciplinaCommand } from './commands/impl/update-disciplina.command';
export { RemoveDisciplinaCommand } from './commands/impl/remove-disciplina.command';
export { GetDisciplinaByIdQuery } from './queries/impl/get-disciplina-by-id.query';
export { ListDisciplinasQuery } from './queries/impl/list-disciplinas.query';
import { CreateDisciplinaHandler } from './handlers/create-disciplina.handler';
import { GetDisciplinaByIdHandler } from './handlers/get-disciplina-by-id.handler';
import { ListDisciplinasHandler } from './handlers/list-disciplinas.handler';
import { RemoveDisciplinaHandler } from './handlers/remove-disciplina.handler';
import { UpdateDisciplinaHandler } from './handlers/update-disciplina.handler';

export const disciplinaCommandHandlers = [
  CreateDisciplinaHandler,
  UpdateDisciplinaHandler,
  RemoveDisciplinaHandler,
];

export const disciplinaQueryHandlers = [
  GetDisciplinaByIdHandler,
  ListDisciplinasHandler,
];
