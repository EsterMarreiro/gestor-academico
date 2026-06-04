import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CursosService } from '../cursos.service';
import { ListCursosQuery } from '../queries/impl/list-cursos.query';

@QueryHandler(ListCursosQuery)
export class ListCursosHandler implements IQueryHandler<ListCursosQuery> {
  constructor(private readonly cursosService: CursosService) {}

  execute() {
    return this.cursosService.findAll();
  }
}
