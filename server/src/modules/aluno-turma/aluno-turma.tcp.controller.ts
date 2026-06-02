import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ALUNO_TURMA_MSG } from '../../contracts/microservice-patterns';
import { CreateAlunoTurmaDto } from './dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from './dto/update-aluno-turma.dto';
import { AlunoTurmaService } from './aluno-turma.service';

@Controller()
export class AlunoTurmaTcpController {
  constructor(private readonly alunoTurmaService: AlunoTurmaService) {}

  @MessagePattern(ALUNO_TURMA_MSG.create)
  create(@Payload() dto: CreateAlunoTurmaDto) {
    return this.alunoTurmaService.create(dto);
  }

  @MessagePattern(ALUNO_TURMA_MSG.findAll)
  findAll() {
    return this.alunoTurmaService.findAll();
  }

  @MessagePattern(ALUNO_TURMA_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.alunoTurmaService.findOne(id);
  }

  @MessagePattern(ALUNO_TURMA_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateAlunoTurmaDto }) {
    return this.alunoTurmaService.update(payload.id, payload.dto);
  }

  @MessagePattern(ALUNO_TURMA_MSG.remove)
  remove(@Payload() id: number) {
    return this.alunoTurmaService.remove(id);
  }
}
