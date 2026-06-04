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
import { MATRICULA_MSG } from '../contracts/microservice-patterns';
import { CreateMatriculaDto } from '../modules/matricula/dto/create-matricula.dto';
import { UpdateMatriculaDto } from '../modules/matricula/dto/update-matricula.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { GatewayCacheService } from '../shared/cache/gateway-cache.service';
import { MATRICULAS_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('Matrículas')
@Controller('matricula')
export class MatriculasGatewayController {
  constructor(
    @Inject(MATRICULAS_SERVICE_TOKEN)
    private readonly matriculasClient: ClientProxy,
    private readonly cache: GatewayCacheService,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({
    summary: 'Cria uma nova matrícula',
    description: 'Encaminhado ao microserviço de matrículas via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Matrícula criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  async create(@Body() createMatriculaDto: CreateMatriculaDto) {
    const result = await this.rpc.send(
      this.matriculasClient,
      MATRICULA_MSG.create,
      createMatriculaDto,
      'matriculas-ms',
    );
    await this.cache.delete('gateway:matriculas:list');
    return result;
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
    return this.cache.remember('gateway:matriculas:list', () =>
      this.rpc.send(
        this.matriculasClient,
        MATRICULA_MSG.findAll,
        {},
        'matriculas-ms',
      ),
    );
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
    return this.cache.remember(`gateway:matriculas:item:${id}`, () =>
      this.rpc.send(
        this.matriculasClient,
        MATRICULA_MSG.findOne,
        +id,
        'matriculas-ms',
      ),
    );
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
    return this.updateAndInvalidate(+id, updateMatriculaDto);
  }

  private async updateAndInvalidate(
    id: number,
    updateMatriculaDto: UpdateMatriculaDto,
  ) {
    const result = await this.rpc.send(
      this.matriculasClient,
      MATRICULA_MSG.update,
      {
        id: +id,
        dto: updateMatriculaDto,
      },
      'matriculas-ms',
    );
    await this.cache.deleteMany([
      'gateway:matriculas:list',
      `gateway:matriculas:item:${id}`,
    ]);
    return result;
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
  async remove(@Param('id') id: string) {
    const numericId = +id;
    const result = await this.rpc.send(
      this.matriculasClient,
      MATRICULA_MSG.remove,
      numericId,
      'matriculas-ms',
    );
    await this.cache.deleteMany([
      'gateway:matriculas:list',
      `gateway:matriculas:item:${numericId}`,
    ]);
    return result;
  }
}
