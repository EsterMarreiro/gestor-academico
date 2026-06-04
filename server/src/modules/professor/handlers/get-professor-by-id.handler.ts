import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessorByIdQuery } from '../queries/impl/get-professor-by-id.query';
import { ProfessorService } from '../professor.service';

@QueryHandler(GetProfessorByIdQuery)
export class GetProfessorByIdHandler implements IQueryHandler<GetProfessorByIdQuery> {
  constructor(private readonly professorService: ProfessorService) {}

  execute(query: GetProfessorByIdQuery) {
    return this.professorService.findOne(query.id);
  }
}
