import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DisciplinaService } from '../disciplina.service';
import { ListDisciplinasQuery } from '../queries/impl/list-disciplinas.query';

@QueryHandler(ListDisciplinasQuery)
export class ListDisciplinasHandler implements IQueryHandler<ListDisciplinasQuery> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute() {
    return this.disciplinaService.findAll();
  }
}
