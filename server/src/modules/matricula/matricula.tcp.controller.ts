import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MATRICULA_MSG } from '../../contracts/microservice-patterns';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Controller()
export class MatriculaTcpController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @MessagePattern(MATRICULA_MSG.create)
  create(@Payload() dto: CreateMatriculaDto) {
    return this.matriculaService.create(dto);
  }

  @MessagePattern(MATRICULA_MSG.findAll)
  findAll() {
    return this.matriculaService.findAll();
  }

  @MessagePattern(MATRICULA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.matriculaService.findOne(id);
  }

  @MessagePattern(MATRICULA_MSG.update)
  update(
    @Payload() payload: { id: number; dto: UpdateMatriculaDto },
  ) {
    return this.matriculaService.update(payload.id, payload.dto);
  }

  @MessagePattern(MATRICULA_MSG.remove)
  remove(@Payload() id: number) {
    return this.matriculaService.remove(id);
  }
}
