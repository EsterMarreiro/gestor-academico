import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DisciplinaService } from '../disciplina.service';
import { GetDisciplinaByIdQuery } from '../queries/impl/get-disciplina-by-id.query';

@QueryHandler(GetDisciplinaByIdQuery)
export class GetDisciplinaByIdHandler implements IQueryHandler<GetDisciplinaByIdQuery> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(query: GetDisciplinaByIdQuery) {
    return this.disciplinaService.findOne(query.id);
  }
}
