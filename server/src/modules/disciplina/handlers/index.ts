export { CreateDisciplinaHandler } from './create-disciplina.handler';
export { GetDisciplinaByIdHandler } from './get-disciplina-by-id.handler';
export { ListDisciplinasHandler } from './list-disciplinas.handler';
export { RemoveDisciplinaHandler } from './remove-disciplina.handler';
export { UpdateDisciplinaHandler } from './update-disciplina.handler';

import { CreateDisciplinaHandler } from './create-disciplina.handler';
import { GetDisciplinaByIdHandler } from './get-disciplina-by-id.handler';
import { ListDisciplinasHandler } from './list-disciplinas.handler';
import { RemoveDisciplinaHandler } from './remove-disciplina.handler';
import { UpdateDisciplinaHandler } from './update-disciplina.handler';

export const disciplinaCommandHandlers = [
  CreateDisciplinaHandler,
  UpdateDisciplinaHandler,
  RemoveDisciplinaHandler,
];

export const disciplinaQueryHandlers = [
  GetDisciplinaByIdHandler,
  ListDisciplinasHandler,
];
