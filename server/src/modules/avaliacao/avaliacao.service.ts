import { Injectable } from '@nestjs/common';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  create(_createAvaliacaoDto: CreateAvaliacaoDto) {
    return 'This action adds a new avaliação';
  }

  findAll() {
    return `This action returns all avaliação`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avaliação`;
  }

  update(id: number, _updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return `This action updates a #${id} avaliação`;
  }

  remove(id: number) {
    return `This action removes a #${id} avaliação`;
  }
}
