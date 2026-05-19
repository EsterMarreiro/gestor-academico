import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MATRICULA_MSG } from '../../contracts/microservice-patterns';
import { CreateMatriculaCommand } from './commands/impl/create-matricula.command';
import { RemoveMatriculaCommand } from './commands/impl/remove-matricula.command';
import { UpdateMatriculaCommand } from './commands/impl/update-matricula.command';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { GetMatriculaByIdQuery } from './queries/impl/get-matricula-by-id.query';
import { ListMatriculasQuery } from './queries/impl/list-matriculas.query';

@Controller()
export class MatriculaTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(MATRICULA_MSG.create)
  create(@Payload() dto: CreateMatriculaDto) {
    return this.commandBus.execute(new CreateMatriculaCommand(dto));
  }

  @MessagePattern(MATRICULA_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListMatriculasQuery());
  }

  @MessagePattern(MATRICULA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetMatriculaByIdQuery(id));
  }

  @MessagePattern(MATRICULA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateMatriculaDto }) {
    return this.commandBus.execute(
      new UpdateMatriculaCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(MATRICULA_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveMatriculaCommand(id));
  }
}
