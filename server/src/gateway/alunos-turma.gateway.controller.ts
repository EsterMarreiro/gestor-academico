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
import { ALUNO_TURMA_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoTurmaDto } from '../modules/aluno-turma/dto/create-aluno-turma.dto';
import { UpdateAlunoTurmaDto } from '../modules/aluno-turma/dto/update-aluno-turma.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { ALUNOS_TURMA_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('AlunoTurma')
@Controller('alunos-turma')
export class AlunosTurmaGatewayController {
  constructor(
    @Inject(ALUNOS_TURMA_SERVICE_TOKEN)
    private readonly alunosTurmaClient: ClientProxy,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({ summary: 'Cria vínculo entre aluno e turma' })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Vínculo já existente' })
  @Post()
  create(@Body() dto: CreateAlunoTurmaDto) {
    return this.rpc.send(
      this.alunosTurmaClient,
      ALUNO_TURMA_MSG.create,
      dto,
      'alunos-turma-ms',
    );
  }

  @ApiOperation({ summary: 'Lista vínculos aluno-turma' })
  @Get()
  findAll() {
    return this.rpc.send(
      this.alunosTurmaClient,
      ALUNO_TURMA_MSG.findAll,
      {},
      'alunos-turma-ms',
    );
  }

  @ApiOperation({ summary: 'Busca vínculo aluno-turma por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpc.send(
      this.alunosTurmaClient,
      ALUNO_TURMA_MSG.findOne,
      +id,
      'alunos-turma-ms',
    );
  }

  @ApiOperation({ summary: 'Atualiza vínculo aluno-turma' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoTurmaDto) {
    return this.rpc.send(
      this.alunosTurmaClient,
      ALUNO_TURMA_MSG.update,
      {
        id: +id,
        dto,
      },
      'alunos-turma-ms',
    );
  }

  @ApiOperation({ summary: 'Remove vínculo aluno-turma' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rpc.send(
      this.alunosTurmaClient,
      ALUNO_TURMA_MSG.remove,
      +id,
      'alunos-turma-ms',
    );
  }
}
