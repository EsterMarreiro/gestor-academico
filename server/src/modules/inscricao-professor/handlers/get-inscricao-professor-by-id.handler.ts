import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInscricaoProfessorByIdQuery } from '../queries/impl/get-inscricao-professor-by-id.query';
import { InscricaoProfessorService } from '../inscricao-professor.service';

@QueryHandler(GetInscricaoProfessorByIdQuery)
export class GetInscricaoProfessorByIdHandler implements IQueryHandler<GetInscricaoProfessorByIdQuery> {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  execute(query: GetInscricaoProfessorByIdQuery) {
    return this.inscricaoProfessorService.findOne(query.id);
  }
}
