import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  create(@Body() createCursosDto: CreateCursosDto) {
    return this.cursosService.create(createCursosDto);
  }

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursosDto: UpdateCursosDto) {
    return this.cursosService.update(+id, updateCursosDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }
}
