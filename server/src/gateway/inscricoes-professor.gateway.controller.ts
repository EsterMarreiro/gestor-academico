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
import { INSCRICAO_PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/create-inscricao-professor.dto';
import { UpdateInscricaoProfessorDto } from '../modules/inscricao-professor/dto/update-inscricao-professor.dto';
import { INSCRICOES_PROFESSOR_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('InscricoesProfessor')
@Controller('inscricoes-professor')
export class InscricoesProfessorGatewayController {
  constructor(
    @Inject(INSCRICOES_PROFESSOR_SERVICE_TOKEN)
    private readonly inscricoesProfessorClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Cria inscrição de professor em disciplina' })
  @ApiResponse({ status: 201, description: 'Inscrição criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Conflito de regra de negócio' })
  @Post()
  create(@Body() dto: CreateInscricaoProfessorDto) {
    return sendRpc(
      this.inscricoesProfessorClient,
      INSCRICAO_PROFESSOR_MSG.create,
      dto,
    );
  }

  @ApiOperation({ summary: 'Lista inscrições de professor' })
  @Get()
  findAll() {
    return sendRpc(
      this.inscricoesProfessorClient,
      INSCRICAO_PROFESSOR_MSG.findAll,
      {},
    );
  }

  @ApiOperation({ summary: 'Busca inscrição de professor por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(
      this.inscricoesProfessorClient,
      INSCRICAO_PROFESSOR_MSG.findOne,
      +id,
    );
  }

  @ApiOperation({ summary: 'Atualiza inscrição de professor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInscricaoProfessorDto) {
    return sendRpc(
      this.inscricoesProfessorClient,
      INSCRICAO_PROFESSOR_MSG.update,
      {
        id: +id,
        dto,
      },
    );
  }

  @ApiOperation({ summary: 'Remove inscrição de professor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(
      this.inscricoesProfessorClient,
      INSCRICAO_PROFESSOR_MSG.remove,
      +id,
    );
  }
}
