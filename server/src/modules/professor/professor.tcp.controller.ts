import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PROFESSOR_MSG } from '../../contracts/microservice-patterns';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import {
  CreateProfessorCommand,
  GetProfessorByIdQuery,
  ListProfessoresQuery,
  RemoveProfessorCommand,
  UpdateProfessorCommand,
} from './professor.cqrs';

@Controller()
export class ProfessorTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(PROFESSOR_MSG.create)
  create(@Payload() dto: CreateProfessorDto) {
    return this.commandBus.execute(new CreateProfessorCommand(dto));
  }

  @MessagePattern(PROFESSOR_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListProfessoresQuery());
  }

  @MessagePattern(PROFESSOR_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetProfessorByIdQuery(id));
  }

  @MessagePattern(PROFESSOR_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateProfessorDto }) {
    return this.commandBus.execute(
      new UpdateProfessorCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(PROFESSOR_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveProfessorCommand(id));
  }
}
