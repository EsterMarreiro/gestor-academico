import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AULA_MSG } from '../../contracts/microservice-patterns';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Controller()
export class AulaTcpController {
  constructor(private readonly aulaService: AulaService) {}

  @MessagePattern(AULA_MSG.create)
  create(@Payload() dto: CreateAulaDto) {
    return this.aulaService.create(dto);
  }

  @MessagePattern(AULA_MSG.findAll)
  findAll() {
    return this.aulaService.findAll();
  }

  @MessagePattern(AULA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.aulaService.findOne(id);
  }

  @MessagePattern(AULA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateAulaDto }) {
    return this.aulaService.update(payload.id, payload.dto);
  }

  @MessagePattern(AULA_MSG.remove)
  remove(@Payload() id: number) {
    return this.aulaService.remove(id);
  }
}
