import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PROFESSOR_MSG } from '../../contracts/microservice-patterns';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorService } from './professor.service';

@Controller()
export class ProfessorTcpController {
  constructor(private readonly professorService: ProfessorService) {}

  @MessagePattern(PROFESSOR_MSG.create)
  create(@Payload() dto: CreateProfessorDto) {
    return this.professorService.create(dto);
  }

  @MessagePattern(PROFESSOR_MSG.findAll)
  findAll() {
    return this.professorService.findAll();
  }

  @MessagePattern(PROFESSOR_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.professorService.findOne(id);
  }

  @MessagePattern(PROFESSOR_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateProfessorDto }) {
    return this.professorService.update(payload.id, payload.dto);
  }

  @MessagePattern(PROFESSOR_MSG.remove)
  remove(@Payload() id: number) {
    return this.professorService.remove(id);
  }
}
