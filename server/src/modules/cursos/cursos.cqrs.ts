export { CreateCursoCommand } from './commands/impl/create-curso.command';
export { UpdateCursoCommand } from './commands/impl/update-curso.command';
export { RemoveCursoCommand } from './commands/impl/remove-curso.command';
export { GetCursoByIdQuery } from './queries/impl/get-curso-by-id.query';
export { ListCursosQuery } from './queries/impl/list-cursos.query';
import { CreateCursoHandler } from './handlers/create-curso.handler';
import { GetCursoByIdHandler } from './handlers/get-curso-by-id.handler';
import { ListCursosHandler } from './handlers/list-cursos.handler';
import { RemoveCursoHandler } from './handlers/remove-curso.handler';
import { UpdateCursoHandler } from './handlers/update-curso.handler';

export const cursosCommandHandlers = [
  CreateCursoHandler,
  UpdateCursoHandler,
  RemoveCursoHandler,
];

export const cursosQueryHandlers = [GetCursoByIdHandler, ListCursosHandler];
