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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CURSO_MSG } from '../contracts/microservice-patterns';
import { CreateCursoDto } from '../modules/cursos/dto/create-curso.dto';
import { UpdateCursoDto } from '../modules/cursos/dto/update-curso.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { CURSOS_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosGatewayController {
  constructor(
    @Inject(CURSOS_SERVICE_TOKEN) private readonly cursosClient: ClientProxy,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({
    summary: 'Cria um novo curso',
    description: 'Encaminhado ao microserviço de cursos via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.rpc.send(
      this.cursosClient,
      CURSO_MSG.create,
      createCursoDto,
      'cursos-ms',
    );
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
    return this.rpc.send(this.cursosClient, CURSO_MSG.findAll, {}, 'cursos-ms');
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
    return this.rpc.send(
      this.cursosClient,
      CURSO_MSG.findOne,
      +id,
      'cursos-ms',
    );
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
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.rpc.send(
      this.cursosClient,
      CURSO_MSG.update,
      {
        id: +id,
        dto: updateCursoDto,
      },
      'cursos-ms',
    );
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
    return this.rpc.send(this.cursosClient, CURSO_MSG.remove, +id, 'cursos-ms');
  }
}
