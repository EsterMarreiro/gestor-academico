import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AlunoService } from '../aluno.service';
import { GetAlunoByIdQuery } from '../queries/impl/get-aluno-by-id.query';

@QueryHandler(GetAlunoByIdQuery)
export class GetAlunoByIdHandler implements IQueryHandler<GetAlunoByIdQuery> {
  constructor(private readonly alunoService: AlunoService) {}

  execute(query: GetAlunoByIdQuery) {
    return this.alunoService.findOne(query.id);
  }
}
