import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INSCRICAO_PROFESSOR_MSG } from '../../contracts/microservice-patterns';
import { CreateInscricaoProfessorDto } from './dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from './dto/update-inscricao-professor.dto';
import { InscricaoProfessorService } from './inscricao-professor.service';

@Controller()
export class InscricaoProfessorTcpController {
  constructor(
    private readonly inscricaoProfessorService: InscricaoProfessorService,
  ) {}

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.create)
  create(@Payload() dto: CreateInscricaoProfessorDto) {
    return this.inscricaoProfessorService.create(dto);
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.findAll)
  findAll() {
    return this.inscricaoProfessorService.findAll();
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.inscricaoProfessorService.findOne(id);
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateInscricaoProfessorDto }) {
    return this.inscricaoProfessorService.update(payload.id, payload.dto);
  }

  @MessagePattern(INSCRICAO_PROFESSOR_MSG.remove)
  remove(@Payload() id: number) {
    return this.inscricaoProfessorService.remove(id);
  }
}
