import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ALUNO_MSG } from '../../contracts/microservice-patterns';
import {
  CreateAlunoCommand,
  GetAlunoByIdQuery,
  ListAlunosQuery,
  RemoveAlunoCommand,
  UpdateAlunoCommand,
} from './aluno.cqrs';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller()
export class AlunoTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(ALUNO_MSG.create)
  create(@Payload() dto: CreateAlunoDto) {
    return this.commandBus.execute(new CreateAlunoCommand(dto));
  }

  @MessagePattern(ALUNO_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListAlunosQuery());
  }

  @MessagePattern(ALUNO_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetAlunoByIdQuery(id));
  }

  @MessagePattern(ALUNO_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateAlunoDto }) {
    return this.commandBus.execute(
      new UpdateAlunoCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(ALUNO_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveAlunoCommand(id));
  }
}
