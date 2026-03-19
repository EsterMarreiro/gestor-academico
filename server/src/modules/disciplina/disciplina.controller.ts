import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@ApiTags('Disciplinas')
@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @ApiOperation({
    summary: 'Cria uma nova disciplina',
    description: 'Cria uma nova disciplina',
  })
  @ApiResponse({ status: 201, description: 'Disciplina criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinaService.create(createDisciplinaDto);
  }

  @ApiOperation({
    summary: 'Lista todas as disciplinas',
    description: 'Retorna uma lista de todas as disciplinas cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as disciplinas foram retornadas com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Disciplinas não encontradas' })
  @Get()
  findAll() {
    return this.disciplinaService.findAll();
  }

  @ApiOperation({
    summary: 'Lista os dados de uma disciplina específica',
    description: 'Retorna os detalhes de uma disciplina específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Disciplina encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da disciplina',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplinaService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma disciplina específica',
    description: 'Atualiza os detalhes de uma disciplina específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Disciplina atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da disciplina',
    type: Number,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplinaDto: UpdateDisciplinaDto,
  ) {
    return this.disciplinaService.update(+id, updateDisciplinaDto);
  }

  @ApiOperation({
    summary: 'Deleta uma disciplina específica',
    description: 'Deleta uma disciplina específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Disciplina deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da disciplina',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplinaService.remove(+id);
  }
}