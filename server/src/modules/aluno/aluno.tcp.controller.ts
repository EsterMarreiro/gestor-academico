import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ALUNO_MSG } from '../../contracts/microservice-patterns';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Controller()
export class AlunoTcpController {
  constructor(private readonly alunoService: AlunoService) {}

  @MessagePattern(ALUNO_MSG.create)
  create(@Payload() dto: CreateAlunoDto) {
    return this.alunoService.create(dto);
  }

  @MessagePattern(ALUNO_MSG.findAll)
  findAll() {
    return this.alunoService.findAll();
  }

  @MessagePattern(ALUNO_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.alunoService.findOne(id);
  }

  @MessagePattern(ALUNO_MSG.update)
  update(@Payload() payload: { id: number; dto: UpdateAlunoDto }) {
    return this.alunoService.update(payload.id, payload.dto);
  }

  @MessagePattern(ALUNO_MSG.remove)
  remove(@Payload() id: number) {
    return this.alunoService.remove(id);
  }
}
