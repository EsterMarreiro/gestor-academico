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
import { ALUNO_MSG } from '../contracts/microservice-patterns';
import { CreateAlunoDto } from '../modules/aluno/dto/create-aluno.dto';
import { UpdateAlunoDto } from '../modules/aluno/dto/update-aluno.dto';
import { RpcResilienceService } from '../resilience/rpc-resilience.service';
import { ALUNOS_SERVICE_TOKEN } from './gateway-tokens';

@ApiTags('Alunos')
@Controller('alunos')
export class AlunosGatewayController {
  constructor(
    @Inject(ALUNOS_SERVICE_TOKEN) private readonly alunosClient: ClientProxy,
    private readonly rpc: RpcResilienceService,
  ) {}

  @ApiOperation({
    summary: 'Cria um aluno',
    description:
      'Liga a um utilizador existente pelo `usuarioId` (id devolvido por POST /users). numeroMatricula é opcional (gerado se faltar).',
  })
  @ApiResponse({ status: 201, description: 'Aluno criado' })
  @ApiResponse({
    status: 400,
    description:
      'Corpo inválido ou utilizador inexistente (referência inválida).',
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe aluno para este utilizador ou número de matrícula em conflito.',
  })
  @Post()
  create(@Body() dto: CreateAlunoDto) {
    return this.rpc.send(this.alunosClient, ALUNO_MSG.create, dto, 'alunos-ms');
  }

  @ApiOperation({ summary: 'Lista alunos' })
  @Get()
  findAll() {
    return this.rpc.send(this.alunosClient, ALUNO_MSG.findAll, {}, 'alunos-ms');
  }

  @ApiOperation({ summary: 'Obtém aluno por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpc.send(
      this.alunosClient,
      ALUNO_MSG.findOne,
      +id,
      'alunos-ms',
    );
  }

  @ApiOperation({ summary: 'Atualiza aluno' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Conflito de matrícula ou utilizador',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoDto) {
    return this.rpc.send(
      this.alunosClient,
      ALUNO_MSG.update,
      {
        id: +id,
        dto,
      },
      'alunos-ms',
    );
  }

  @ApiOperation({ summary: 'Remove aluno' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rpc.send(this.alunosClient, ALUNO_MSG.remove, +id, 'alunos-ms');
  }
}
