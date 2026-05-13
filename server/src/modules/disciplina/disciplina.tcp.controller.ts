import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DISCIPLINA_MSG } from '../../contracts/microservice-patterns';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import {
  CreateDisciplinaCommand,
  GetDisciplinaByIdQuery,
  ListDisciplinasQuery,
  RemoveDisciplinaCommand,
  UpdateDisciplinaCommand,
} from './disciplina.cqrs';

@Controller()
export class DisciplinaTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(DISCIPLINA_MSG.create)
  create(@Payload() dto: CreateDisciplinaDto) {
    return this.commandBus.execute(new CreateDisciplinaCommand(dto));
  }

  @MessagePattern(DISCIPLINA_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListDisciplinasQuery());
  }

  @MessagePattern(DISCIPLINA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetDisciplinaByIdQuery(id));
  }

  @MessagePattern(DISCIPLINA_MSG.update)
  update(
    @Payload() payload: { id: number; dto: UpdateDisciplinaDto },
  ) {
    return this.commandBus.execute(
      new UpdateDisciplinaCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(DISCIPLINA_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveDisciplinaCommand(id));
  }
}
