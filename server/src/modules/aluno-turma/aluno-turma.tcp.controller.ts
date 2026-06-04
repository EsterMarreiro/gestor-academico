import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ALUNO_TURMA_MSG } from '../../contracts/microservice-patterns';
import {
  CreateAlunoTurmaCommand,
  GetAlunoTurmaByIdQuery,
  ListAlunosTurmaQuery,
  RemoveAlunoTurmaCommand,
  UpdateAlunoTurmaCommand,
} from './aluno-turma.cqrs';
import { CreateAlunoTurmaDto } from './dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from './dto/update-aluno-turma.dto';

@Controller()
export class AlunoTurmaTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(ALUNO_TURMA_MSG.create)
  create(@Payload() dto: CreateAlunoTurmaDto) {
    return this.commandBus.execute(new CreateAlunoTurmaCommand(dto));
  }

  @MessagePattern(ALUNO_TURMA_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListAlunosTurmaQuery());
  }

  @MessagePattern(ALUNO_TURMA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetAlunoTurmaByIdQuery(id));
  }

  @MessagePattern(ALUNO_TURMA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateAlunoTurmaDto }) {
    return this.commandBus.execute(
      new UpdateAlunoTurmaCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(ALUNO_TURMA_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveAlunoTurmaCommand(id));
  }
}
