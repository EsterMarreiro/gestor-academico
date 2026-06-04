import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CURSO_MSG } from '../../contracts/microservice-patterns';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import {
  CreateCursoCommand,
  GetCursoByIdQuery,
  ListCursosQuery,
  RemoveCursoCommand,
  UpdateCursoCommand,
} from './cursos.cqrs';

@Controller()
export class CursosTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(CURSO_MSG.create)
  create(@Payload() dto: CreateCursoDto) {
    return this.commandBus.execute(new CreateCursoCommand(dto));
  }

  @MessagePattern(CURSO_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListCursosQuery());
  }

  @MessagePattern(CURSO_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetCursoByIdQuery(id));
  }

  @MessagePattern(CURSO_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateCursoDto }) {
    return this.commandBus.execute(
      new UpdateCursoCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(CURSO_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveCursoCommand(id));
  }
}
