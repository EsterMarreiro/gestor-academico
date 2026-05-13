import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TURMA_MSG } from '../../contracts/microservice-patterns';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import {
  CreateTurmaCommand,
  GetTurmaByIdQuery,
  ListTurmasQuery,
  RemoveTurmaCommand,
  UpdateTurmaCommand,
} from './turmas.cqrs';

@Controller()
export class TurmasTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(TURMA_MSG.create)
  create(@Payload() dto: CreateTurmaDto) {
    return this.commandBus.execute(new CreateTurmaCommand(dto));
  }

  @MessagePattern(TURMA_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListTurmasQuery());
  }

  @MessagePattern(TURMA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetTurmaByIdQuery(id));
  }

  @MessagePattern(TURMA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateTurmaDto }) {
    return this.commandBus.execute(
      new UpdateTurmaCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(TURMA_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveTurmaCommand(id));
  }
}
