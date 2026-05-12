import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DISCIPLINA_MSG } from '../../contracts/microservice-patterns';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller()
export class DisciplinaTcpController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @MessagePattern(DISCIPLINA_MSG.create)
  create(@Payload() dto: CreateDisciplinaDto) {
    return this.disciplinaService.create(dto);
  }

  @MessagePattern(DISCIPLINA_MSG.findAll)
  findAll() {
    return this.disciplinaService.findAll();
  }

  @MessagePattern(DISCIPLINA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.disciplinaService.findOne(id);
  }

  @MessagePattern(DISCIPLINA_MSG.update)
  update(
    @Payload() payload: { id: number; dto: UpdateDisciplinaDto },
  ) {
    return this.disciplinaService.update(payload.id, payload.dto);
  }

  @MessagePattern(DISCIPLINA_MSG.remove)
  remove(@Payload() id: number) {
    return this.disciplinaService.remove(id);
  }
}
