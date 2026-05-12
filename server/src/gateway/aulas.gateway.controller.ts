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
import { AULA_MSG } from '../contracts/microservice-patterns';
import { CreateAulaDto } from '../modules/aula/dto/create-aula.dto';
import { UpdateAulaDto } from '../modules/aula/dto/update-aula.dto';
import { AULAS_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('Aulas')
@Controller('aula')
export class AulasGatewayController {
  constructor(
    @Inject(AULAS_SERVICE_TOKEN) private readonly aulasClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Cria uma nova aula',
    description: 'Encaminhado ao microserviço de aulas via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Aula criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    return sendRpc(this.aulasClient, AULA_MSG.create, createAulaDto);
  }

  @ApiOperation({
    summary: 'Lista todas as aulas',
    description: 'Encaminhado ao microserviço de aulas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as aulas foram retornadas com sucesso.',
  })
  @Get()
  findAll() {
    return sendRpc(this.aulasClient, AULA_MSG.findAll, {});
  }

  @ApiOperation({
    summary: 'Obtém uma aula por id',
    description: 'Encaminhado ao microserviço de aulas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Aula encontrada' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da aula',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(this.aulasClient, AULA_MSG.findOne, +id);
  }

  @ApiOperation({
    summary: 'Atualiza uma aula',
    description: 'Encaminhado ao microserviço de aulas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Aula atualizada' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da aula',
    type: Number,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAulaDto: UpdateAulaDto,
  ) {
    return sendRpc(this.aulasClient, AULA_MSG.update, {
      id: +id,
      dto: updateAulaDto,
    });
  }

  @ApiOperation({
    summary: 'Remove uma aula',
    description: 'Encaminhado ao microserviço de aulas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Aula removida' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da aula',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(this.aulasClient, AULA_MSG.remove, +id);
  }
}
