import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Cria um novo usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @ApiOperation({
    summary: 'Lista todos os usuários',
    description:
      'Retorna uma lista de todos os usuários cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todos os usuários foram retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuários não encontrados' })
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiOperation({
    summary: 'Lista os dados de um usuário específico',
    description:
      'Retorna os detalhes de um usuário específico com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de um usuário específico',
    description:
      'Atualiza os detalhes de um usuário específico com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @ApiOperation({
    summary: 'Deleta um usuário específico',
    description: 'Deleta um usuário específico com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
