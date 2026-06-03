import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProfessoresQuery } from '../queries/impl/list-professores.query';
import { ProfessorService } from '../professor.service';

@QueryHandler(ListProfessoresQuery)
export class ListProfessoresHandler implements IQueryHandler<ListProfessoresQuery> {
  constructor(private readonly professorService: ProfessorService) {}

  execute() {
    return this.professorService.findAll();
  }
}
