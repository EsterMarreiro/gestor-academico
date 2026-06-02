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
import { ALUNOS_TURMA_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('AlunoTurma')
@Controller('alunos-turma')
export class AlunosTurmaGatewayController {
  constructor(
    @Inject(ALUNOS_TURMA_SERVICE_TOKEN)
    private readonly alunosTurmaClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Cria vínculo entre aluno e turma' })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Vínculo já existente' })
  @Post()
  create(@Body() dto: CreateAlunoTurmaDto) {
    return sendRpc(this.alunosTurmaClient, ALUNO_TURMA_MSG.create, dto);
  }

  @ApiOperation({ summary: 'Lista vínculos aluno-turma' })
  @Get()
  findAll() {
    return sendRpc(this.alunosTurmaClient, ALUNO_TURMA_MSG.findAll, {});
  }

  @ApiOperation({ summary: 'Busca vínculo aluno-turma por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(this.alunosTurmaClient, ALUNO_TURMA_MSG.findOne, +id);
  }

  @ApiOperation({ summary: 'Atualiza vínculo aluno-turma' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlunoTurmaDto) {
    return sendRpc(this.alunosTurmaClient, ALUNO_TURMA_MSG.update, {
      id: +id,
      dto,
    });
  }

  @ApiOperation({ summary: 'Remove vínculo aluno-turma' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(this.alunosTurmaClient, ALUNO_TURMA_MSG.remove, +id);
  }
}
