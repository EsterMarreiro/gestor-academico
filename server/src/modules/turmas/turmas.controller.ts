import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { TurmasService } from './turmas.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@ApiTags('Turmas')
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @ApiOperation({
    summary: 'Cria uma nova turma',
    description: 'Cria uma nova turma',
  })
  @ApiResponse({
    status: 201,
    description: 'Turma criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.turmasService.create(createTurmaDto);
  }

  @ApiOperation({
    summary: 'Lista todas as turmas',
    description: 'Retorna uma lista de todas as turmas cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as turmas foram retornadas com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Turmas não encontradas' })
  @Get()
  findAll() {
    return this.turmasService.findAll();
  }

  @ApiOperation({
    summary: 'Lista os dados de uma turma específica',
    description: 'Retorna os detalhes de uma turma específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da turma',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma turma específica',
    description: 'Atualiza os detalhes de uma turma específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma atualizada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da turma',
    type: Number,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmasService.update(+id, updateTurmaDto);
  }

  @ApiOperation({
    summary: 'Deleta uma turma específica',
    description: 'Deleta uma turma específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Turma deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da turma',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(+id);
  }
}