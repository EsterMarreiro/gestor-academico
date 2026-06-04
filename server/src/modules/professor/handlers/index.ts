export { CreateProfessorHandler } from './create-professor.handler';
export { GetProfessorByIdHandler } from './get-professor-by-id.handler';
export { ListProfessoresHandler } from './list-professores.handler';
export { RemoveProfessorHandler } from './remove-professor.handler';
export { UpdateProfessorHandler } from './update-professor.handler';

import { CreateProfessorHandler } from './create-professor.handler';
import { GetProfessorByIdHandler } from './get-professor-by-id.handler';
import { ListProfessoresHandler } from './list-professores.handler';
import { RemoveProfessorHandler } from './remove-professor.handler';
import { UpdateProfessorHandler } from './update-professor.handler';

export const professorCommandHandlers = [
  CreateProfessorHandler,
  UpdateProfessorHandler,
  RemoveProfessorHandler,
];

export const professorQueryHandlers = [
  GetProfessorByIdHandler,
  ListProfessoresHandler,
];
