import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TURMA_MSG } from '../../contracts/microservice-patterns';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller()
export class TurmasTcpController {
  constructor(private readonly turmasService: TurmasService) {}

  @MessagePattern(TURMA_MSG.create)
  create(@Payload() dto: CreateTurmaDto) {
    return this.turmasService.create(dto);
  }

  @MessagePattern(TURMA_MSG.findAll)
  findAll() {
    return this.turmasService.findAll();
  }

  @MessagePattern(TURMA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.turmasService.findOne(id);
  }

  @MessagePattern(TURMA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateTurmaDto }) {
    return this.turmasService.update(payload.id, payload.dto);
  }

  @MessagePattern(TURMA_MSG.remove)
  remove(@Payload() id: number) {
    return this.turmasService.remove(id);
  }
}
