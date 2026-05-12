import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CURSO_MSG } from '../../contracts/microservice-patterns';
import { CursosService } from './cursos.service';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';

@Controller()
export class CursosTcpController {
  constructor(private readonly cursosService: CursosService) {}

  @MessagePattern(CURSO_MSG.create)
  create(@Payload() dto: CreateCursosDto) {
    return this.cursosService.create(dto);
  }

  @MessagePattern(CURSO_MSG.findAll)
  findAll() {
    return this.cursosService.findAll();
  }

  @MessagePattern(CURSO_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.cursosService.findOne(id);
  }

  @MessagePattern(CURSO_MSG.update)
  update(
    @Payload() payload: { id: number; dto: UpdateCursosDto },
  ) {
    return this.cursosService.update(payload.id, payload.dto);
  }

  @MessagePattern(CURSO_MSG.remove)
  remove(@Payload() id: number) {
    return this.cursosService.remove(id);
  }
}
