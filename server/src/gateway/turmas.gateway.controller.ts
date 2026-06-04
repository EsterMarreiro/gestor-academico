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
import { TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateTurmaDto } from '../modules/turmas/dto/create-turma.dto';
import { UpdateTurmaDto } from '../modules/turmas/dto/update-turma.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { TURMAS_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('Turmas')
@Controller('turmas')
export class TurmasGatewayController {
  constructor(
    @Inject(TURMAS_SERVICE_TOKEN) private readonly turmasClient: ClientProxy,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({
    summary: 'Cria uma nova turma',
    description: 'Encaminhado ao microserviço de turmas via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createTurmaDto: CreateTurmaDto) {
    return this.rpc.send(
      this.turmasClient,
      TURMA_MSG.create,
      createTurmaDto,
      'turmas-ms',
    );
  }

  @ApiOperation({
    summary: 'Lista todas as turmas',
    description: 'Encaminhado ao microserviço de turmas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as turmas foram retornadas com sucesso.',
  })
  @Get()
  findAll() {
    return this.rpc.send(this.turmasClient, TURMA_MSG.findAll, {}, 'turmas-ms');
  }

  @ApiOperation({
    summary: 'Lista os dados de uma turma específica',
    description: 'Encaminhado ao microserviço de turmas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Turma encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da turma',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpc.send(
      this.turmasClient,
      TURMA_MSG.findOne,
      +id,
      'turmas-ms',
    );
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma turma específica',
    description: 'Encaminhado ao microserviço de turmas via API Gateway.',
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
    return this.rpc.send(
      this.turmasClient,
      TURMA_MSG.update,
      {
        id: +id,
        dto: updateTurmaDto,
      },
      'turmas-ms',
    );
  }

  @ApiOperation({
    summary: 'Deleta uma turma específica',
    description: 'Encaminhado ao microserviço de turmas via API Gateway.',
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
    return this.rpc.send(this.turmasClient, TURMA_MSG.remove, +id, 'turmas-ms');
  }
}
