import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTurmasQuery } from '../queries/impl/list-turmas.query';
import { TurmasService } from '../turmas.service';

@QueryHandler(ListTurmasQuery)
export class ListTurmasHandler implements IQueryHandler<ListTurmasQuery> {
  constructor(private readonly turmasService: TurmasService) {}

  execute() {
    return this.turmasService.findAll();
  }
}
