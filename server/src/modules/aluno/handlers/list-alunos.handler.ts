import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AlunoService } from '../aluno.service';
import { ListAlunosQuery } from '../queries/impl/list-alunos.query';

@QueryHandler(ListAlunosQuery)
export class ListAlunosHandler implements IQueryHandler<ListAlunosQuery> {
  constructor(private readonly alunoService: AlunoService) {}

  execute() {
    return this.alunoService.findAll();
  }
}
