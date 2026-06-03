export { CreateProfessorCommand } from './commands/impl/create-professor.command';
export { UpdateProfessorCommand } from './commands/impl/update-professor.command';
export { RemoveProfessorCommand } from './commands/impl/remove-professor.command';
export { GetProfessorByIdQuery } from './queries/impl/get-professor-by-id.query';
export { ListProfessoresQuery } from './queries/impl/list-professores.query';
import { CreateProfessorHandler } from './handlers/create-professor.handler';
import { GetProfessorByIdHandler } from './handlers/get-professor-by-id.handler';
import { ListProfessoresHandler } from './handlers/list-professores.handler';
import { RemoveProfessorHandler } from './handlers/remove-professor.handler';
import { UpdateProfessorHandler } from './handlers/update-professor.handler';

export const professorCommandHandlers = [
  CreateProfessorHandler,
  UpdateProfessorHandler,
  RemoveProfessorHandler,
];

export const professorQueryHandlers = [
  GetProfessorByIdHandler,
  ListProfessoresHandler,
];
