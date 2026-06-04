export { CreateCursoHandler } from './create-curso.handler';
export { GetCursoByIdHandler } from './get-curso-by-id.handler';
export { ListCursosHandler } from './list-cursos.handler';
export { RemoveCursoHandler } from './remove-curso.handler';
export { UpdateCursoHandler } from './update-curso.handler';

import { CreateCursoHandler } from './create-curso.handler';
import { GetCursoByIdHandler } from './get-curso-by-id.handler';
import { ListCursosHandler } from './list-cursos.handler';
import { RemoveCursoHandler } from './remove-curso.handler';
import { UpdateCursoHandler } from './update-curso.handler';

export const cursosCommandHandlers = [
  CreateCursoHandler,
  UpdateCursoHandler,
  RemoveCursoHandler,
];

export const cursosQueryHandlers = [GetCursoByIdHandler, ListCursosHandler];
