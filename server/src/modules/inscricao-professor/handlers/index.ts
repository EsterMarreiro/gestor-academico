export { CreateInscricaoProfessorHandler } from './create-inscricao-professor.handler';
export { GetInscricaoProfessorByIdHandler } from './get-inscricao-professor-by-id.handler';
export { ListInscricoesProfessorHandler } from './list-inscricoes-professor.handler';
export { RemoveInscricaoProfessorHandler } from './remove-inscricao-professor.handler';
export { UpdateInscricaoProfessorHandler } from './update-inscricao-professor.handler';

import { CreateInscricaoProfessorHandler } from './create-inscricao-professor.handler';
import { GetInscricaoProfessorByIdHandler } from './get-inscricao-professor-by-id.handler';
import { ListInscricoesProfessorHandler } from './list-inscricoes-professor.handler';
import { RemoveInscricaoProfessorHandler } from './remove-inscricao-professor.handler';
import { UpdateInscricaoProfessorHandler } from './update-inscricao-professor.handler';

export const inscricaoProfessorCommandHandlers = [
  CreateInscricaoProfessorHandler,
  UpdateInscricaoProfessorHandler,
  RemoveInscricaoProfessorHandler,
];

export const inscricaoProfessorQueryHandlers = [
  GetInscricaoProfessorByIdHandler,
  ListInscricoesProfessorHandler,
];
