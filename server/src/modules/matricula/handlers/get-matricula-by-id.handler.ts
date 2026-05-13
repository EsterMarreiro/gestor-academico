import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMatriculaByIdQuery } from '../queries/impl/get-matricula-by-id.query';
import { MatriculaReadRepository } from '../repositories/matricula-read.repository';

@QueryHandler(GetMatriculaByIdQuery)
export class GetMatriculaByIdHandler
  implements IQueryHandler<GetMatriculaByIdQuery>
{
  constructor(private readonly readRepository: MatriculaReadRepository) {}

  execute(query: GetMatriculaByIdQuery) {
    return this.readRepository.findOne(query.id);
  }
}
