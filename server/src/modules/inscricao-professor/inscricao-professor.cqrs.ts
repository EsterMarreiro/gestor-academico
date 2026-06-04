export { CreateInscricaoProfessorCommand } from './commands/impl/create-inscricao-professor.command';
export { UpdateInscricaoProfessorCommand } from './commands/impl/update-inscricao-professor.command';
export { RemoveInscricaoProfessorCommand } from './commands/impl/remove-inscricao-professor.command';
export { GetInscricaoProfessorByIdQuery } from './queries/impl/get-inscricao-professor-by-id.query';
export { ListInscricoesProfessorQuery } from './queries/impl/list-inscricoes-professor.query';
export {
  inscricaoProfessorCommandHandlers,
  inscricaoProfessorQueryHandlers,
} from './handlers';
