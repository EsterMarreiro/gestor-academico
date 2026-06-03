import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AlunoTurmaService } from '../aluno-turma.service';
import { GetAlunoTurmaByIdQuery } from '../queries/impl/get-aluno-turma-by-id.query';

@QueryHandler(GetAlunoTurmaByIdQuery)
export class GetAlunoTurmaByIdHandler implements IQueryHandler<GetAlunoTurmaByIdQuery> {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  execute(query: GetAlunoTurmaByIdQuery) {
    return this.alunoTurmaService.findOne(query.id);
  }
}
