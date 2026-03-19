import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresencaService } from './presenca.service';
import { CreatePresencaDto } from './dto/create-presenca.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Presença')
@Controller('Presença')
export class PresencaController {
  constructor(private readonly presencaService: PresencaService) {}

  @Post()
  create(@Body() createPresencaDto: CreatePresencaDto) {
    return this.presencaService.create(createPresencaDto);
  }

  @Get()
  findAll() {
    return this.presencaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presencaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresencaDto: UpdatePresencaDto) {
    return this.presencaService.update(+id, updatePresencaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presencaService.remove(+id);
  }
}