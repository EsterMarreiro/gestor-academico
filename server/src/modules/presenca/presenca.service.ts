import { Injectable } from '@nestjs/common';
import { CreatePresencaDto } from './dto/create-presenca.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';

@Injectable()
export class PresencaService {
  create(_createPresencaDto: CreatePresencaDto) {
    return 'This action adds a new presenca';
  }

  findAll() {
    return `This action returns all presenca`;
  }

  findOne(id: number) {
    return `This action returns a #${id} presenca`;
  }

  update(id: number, _updatePresencaDto: UpdatePresencaDto) {
    return `This action updates a #${id} presenca`;
  }

  remove(id: number) {
    return `This action removes a #${id} presenca`;
  }
}
