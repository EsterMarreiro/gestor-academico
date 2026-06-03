export { CreateInscricaoProfessorCommand } from './commands/impl/create-inscricao-professor.command';
export { UpdateInscricaoProfessorCommand } from './commands/impl/update-inscricao-professor.command';
export { RemoveInscricaoProfessorCommand } from './commands/impl/remove-inscricao-professor.command';
export { GetInscricaoProfessorByIdQuery } from './queries/impl/get-inscricao-professor-by-id.query';
export { ListInscricoesProfessorQuery } from './queries/impl/list-inscricoes-professor.query';
import { CreateInscricaoProfessorHandler } from './handlers/create-inscricao-professor.handler';
import { GetInscricaoProfessorByIdHandler } from './handlers/get-inscricao-professor-by-id.handler';
import { ListInscricoesProfessorHandler } from './handlers/list-inscricoes-professor.handler';
import { RemoveInscricaoProfessorHandler } from './handlers/remove-inscricao-professor.handler';
import { UpdateInscricaoProfessorHandler } from './handlers/update-inscricao-professor.handler';

export const inscricaoProfessorCommandHandlers = [
  CreateInscricaoProfessorHandler,
  UpdateInscricaoProfessorHandler,
  RemoveInscricaoProfessorHandler,
];

export const inscricaoProfessorQueryHandlers = [
  GetInscricaoProfessorByIdHandler,
  ListInscricoesProfessorHandler,
];
