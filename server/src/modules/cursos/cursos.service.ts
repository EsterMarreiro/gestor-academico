import { Injectable } from '@nestjs/common';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';

@Injectable()
export class CursosService {
  create(createCursosDto: CreateCursosDto) {
    return 'This action adds a new curso';
  }

  findAll() {
    return 'This action returns all cursos';
  }

  findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  update(id: number, updateCursosDto: UpdateCursosDto) {
    return `This action updates a #${id} curso`;
  }

  remove(id: number) {
    return `This action removes a #${id} curso`;
  }
}
