import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListMatriculasQuery } from '../queries/impl/list-matriculas.query';
import { MatriculaReadRepository } from '../repositories/matricula-read.repository';

@QueryHandler(ListMatriculasQuery)
export class ListMatriculasHandler implements IQueryHandler<ListMatriculasQuery> {
  constructor(private readonly readRepository: MatriculaReadRepository) {}

  execute() {
    return this.readRepository.findAll();
  }
}
