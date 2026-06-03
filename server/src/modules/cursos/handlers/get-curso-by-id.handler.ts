import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CursosService } from '../cursos.service';
import { GetCursoByIdQuery } from '../queries/impl/get-curso-by-id.query';

@QueryHandler(GetCursoByIdQuery)
export class GetCursoByIdHandler implements IQueryHandler<GetCursoByIdQuery> {
  constructor(private readonly cursosService: CursosService) {}

  execute(query: GetCursoByIdQuery) {
    return this.cursosService.findOne(query.id);
  }
}
