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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CursosService } from './cursos.service';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @ApiOperation({
    summary: 'Cria um novo curso',
    description: 'Cria um novo curso',
  })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createCursosDto: CreateCursosDto) {
    return this.cursosService.create(createCursosDto);
  }

  @ApiOperation({
    summary: 'Lista todos os cursos',
    description: 'Retorna uma lista de todos os cursos cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todos os cursos foram retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Cursos não encontrados' })
  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @ApiOperation({
    summary: 'Lista os dados de um curso específico',
    description: 'Retorna os detalhes de um curso específico com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Curso encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do curso',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de um curso específico',
    description: 'Atualiza os detalhes de um curso específico com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do curso',
    type: Number,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursosDto: UpdateCursosDto) {
    return this.cursosService.update(+id, updateCursosDto);
  }

  @ApiOperation({
    summary: 'Deleta um curso específico',
    description: 'Deleta um curso específico com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Curso deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do curso',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }
}
