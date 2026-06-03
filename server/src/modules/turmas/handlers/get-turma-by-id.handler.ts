import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTurmaByIdQuery } from '../queries/impl/get-turma-by-id.query';
import { TurmasService } from '../turmas.service';

@QueryHandler(GetTurmaByIdQuery)
export class GetTurmaByIdHandler implements IQueryHandler<GetTurmaByIdQuery> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(query: GetTurmaByIdQuery) {
    return this.turmasService.findOne(query.id);
  }
}
