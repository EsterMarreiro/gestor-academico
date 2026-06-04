import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AlunoTurmaService } from '../aluno-turma.service';
import { ListAlunosTurmaQuery } from '../queries/impl/list-alunos-turma.query';

@QueryHandler(ListAlunosTurmaQuery)
export class ListAlunosTurmaHandler implements IQueryHandler<ListAlunosTurmaQuery> {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  execute() {
    return this.alunoTurmaService.findAll();
  }
}
