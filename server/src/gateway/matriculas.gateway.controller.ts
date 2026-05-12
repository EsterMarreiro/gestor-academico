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
import { MATRICULA_MSG } from '../contracts/microservice-patterns';
import { CreateMatriculaDto } from '../modules/matricula/dto/create-matricula.dto';
import { UpdateMatriculaDto } from '../modules/matricula/dto/update-matricula.dto';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('Matrículas')
@Controller('matricula')
export class MatriculasGatewayController {
  constructor(
    @Inject(MATRICULAS_SERVICE_TOKEN)
    private readonly matriculasClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Cria uma nova matrícula',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Matrícula criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return sendRpc(
      this.matriculasClient,
      MATRICULA_MSG.create,
      createMatriculaDto,
    );
  }

  @ApiOperation({
    summary: 'Lista todas as matrículas',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as matrículas foram retornadas com sucesso.',
  })
  @Get()
  findAll() {
    return sendRpc(this.matriculasClient, MATRICULA_MSG.findAll, {});
  }

  @ApiOperation({
    summary: 'Obtém uma matrícula por id',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Matrícula encontrada' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da matrícula',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(this.matriculasClient, MATRICULA_MSG.findOne, +id);
  }

  @ApiOperation({
    summary: 'Atualiza uma matrícula',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Matrícula atualizada' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da matrícula',
    type: Number,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
  ) {
    return sendRpc(this.matriculasClient, MATRICULA_MSG.update, {
      id: +id,
      dto: updateMatriculaDto,
    });
  }

  @ApiOperation({
    summary: 'Remove uma matrícula',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Matrícula removida' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador da matrícula',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(this.matriculasClient, MATRICULA_MSG.remove, +id);
  }
}
