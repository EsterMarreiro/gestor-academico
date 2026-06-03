import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INSCRICAO_PROFESSOR_MSG } from '../../contracts/microservice-patterns';
import {
  CreateInscricaoProfessorCommand,
  GetInscricaoProfessorByIdQuery,
  ListInscricoesProfessorQuery,
  RemoveInscricaoProfessorCommand,
  UpdateInscricaoProfessorCommand,
} from './inscricao-professor.cqrs';
import { CreateInscricaoProfessorDto } from './dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from './dto/update-inscricao-professor.dto';

@Controller()
export class InscricaoProfessorTcpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.create)
  create(@Payload() dto: CreateInscricaoProfessorDto) {
    return this.commandBus.execute(new CreateInscricaoProfessorCommand(dto));
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.findAll)
  findAll() {
    return this.queryBus.execute(new ListInscricoesProfessorQuery());
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.queryBus.execute(new GetInscricaoProfessorByIdQuery(id));
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateInscricaoProfessorDto }) {
    return this.commandBus.execute(
      new UpdateInscricaoProfessorCommand(payload.id, payload.dto),
    );
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.remove)
  remove(@Payload() id: number) {
    return this.commandBus.execute(new RemoveInscricaoProfessorCommand(id));
  }
}
