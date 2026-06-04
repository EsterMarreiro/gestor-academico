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
import { DISCIPLINA_MSG } from '../contracts/microservice-patterns';
import { CreateDisciplinaDto } from '../modules/disciplina/dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from '../modules/disciplina/dto/update-disciplina.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { DISCIPLINAS_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('Disciplinas')
@Controller('disciplina')
export class DisciplinasGatewayController {
  constructor(
    @Inject(DISCIPLINAS_SERVICE_TOKEN)
    private readonly disciplinasClient: ClientProxy,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({
    summary: 'Cria uma nova disciplina',
    description: 'Encaminhado ao microserviço de disciplinas via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Disciplina criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.rpc.send(
      this.disciplinasClient,
      DISCIPLINA_MSG.create,
      createDisciplinaDto,
      'disciplinas-ms',
    );
  }

  @ApiOperation({
    summary: 'Lista todas as disciplinas',
    description: 'Encaminhado ao microserviço de disciplinas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as disciplinas foram retornadas com sucesso.',
  })
  @Get()
  findAll() {
    return this.rpc.send(
      this.disciplinasClient,
      DISCIPLINA_MSG.findAll,
      {},
      'disciplinas-ms',
    );
  }

  @ApiOperation({
    summary: 'Lista os dados de uma disciplina específica',
    description: 'Encaminhado ao microserviço de disciplinas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Disciplina não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da disciplina',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpc.send(
      this.disciplinasClient,
      DISCIPLINA_MSG.findOne,
      +id,
      'disciplinas-ms',
    );
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma disciplina específica',
    description: 'Encaminhado ao microserviço de disciplinas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina atualizada com sucesso',
  })
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
    return this.rpc.send(
      this.disciplinasClient,
      DISCIPLINA_MSG.update,
      {
        id: +id,
        dto: updateDisciplinaDto,
      },
      'disciplinas-ms',
    );
  }

  @ApiOperation({
    summary: 'Deleta uma disciplina específica',
    description: 'Encaminhado ao microserviço de disciplinas via API Gateway.',
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
    return this.rpc.send(
      this.disciplinasClient,
      DISCIPLINA_MSG.remove,
      +id,
      'disciplinas-ms',
    );
  }
}
