import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListInscricoesProfessorQuery } from '../queries/impl/list-inscricoes-professor.query';
import { InscricaoProfessorService } from '../inscricao-professor.service';

@QueryHandler(ListInscricoesProfessorQuery)
export class ListInscricoesProfessorHandler implements IQueryHandler<ListInscricoesProfessorQuery> {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  execute() {
    return this.inscricaoProfessorService.findAll();
  }
}
