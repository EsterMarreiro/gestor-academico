export { CreateMatriculaHandler } from './create-matricula.handler';
export { GetMatriculaByIdHandler } from './get-matricula-by-id.handler';
export { ListMatriculasHandler } from './list-matriculas.handler';
export { MatriculaCreatedHandler } from './matricula-created.handler';
export { MatriculaRemovedHandler } from './matricula-removed.handler';
export { MatriculaUpdatedHandler } from './matricula-updated.handler';
export { RemoveMatriculaHandler } from './remove-matricula.handler';
export { UpdateMatriculaHandler } from './update-matricula.handler';

import { CreateMatriculaHandler } from './create-matricula.handler';
import { GetMatriculaByIdHandler } from './get-matricula-by-id.handler';
import { ListMatriculasHandler } from './list-matriculas.handler';
import { MatriculaCreatedHandler } from './matricula-created.handler';
import { MatriculaRemovedHandler } from './matricula-removed.handler';
import { MatriculaUpdatedHandler } from './matricula-updated.handler';
import { RemoveMatriculaHandler } from './remove-matricula.handler';
import { UpdateMatriculaHandler } from './update-matricula.handler';

export const matriculaCommandHandlers = [
  CreateMatriculaHandler,
  UpdateMatriculaHandler,
  RemoveMatriculaHandler,
];

export const matriculaQueryHandlers = [
  GetMatriculaByIdHandler,
  ListMatriculasHandler,
];

export const matriculaEventHandlers = [
  MatriculaCreatedHandler,
  MatriculaUpdatedHandler,
  MatriculaRemovedHandler,
];
