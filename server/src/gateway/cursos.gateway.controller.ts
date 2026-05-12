import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CURSO_MSG } from '../contracts/microservice-patterns';
import { CreateCursosDto } from '../modules/cursos/dto/create-cursos.dto';
import { UpdateCursosDto } from '../modules/cursos/dto/update-cursos.dto';
import { CURSOS_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosGatewayController {
  constructor(
    @Inject(CURSOS_SERVICE_TOKEN) private readonly cursosClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Cria um novo curso',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createCursosDto: CreateCursosDto) {
    return sendRpc(this.cursosClient, CURSO_MSG.create, createCursosDto);
  }

  @ApiOperation({
    summary: 'Lista todos os cursos',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todos os cursos foram retornados com sucesso.',
  })
  @Get()
  findAll() {
    return sendRpc(this.cursosClient, CURSO_MSG.findAll, {});
  }

  @ApiOperation({
    summary: 'Lista os dados de um curso específico',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
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
    return sendRpc(this.cursosClient, CURSO_MSG.findOne, +id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de um curso específico',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do curso',
    type: Number,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCursosDto: UpdateCursosDto,
  ) {
    return sendRpc(this.cursosClient, CURSO_MSG.update, {
      id: +id,
      dto: updateCursosDto,
    });
  }

  @ApiOperation({
    summary: 'Deleta um curso específico',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
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
    return sendRpc(this.cursosClient, CURSO_MSG.remove, +id);
  }
}
