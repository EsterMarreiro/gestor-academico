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
import { PROFESSOR_MSG } from '../contracts/microservice-patterns';
import { CreateProfessorDto } from '../modules/professor/dto/create-professor.dto';
import { UpdateProfessorDto } from '../modules/professor/dto/update-professor.dto';
import { PROFESSORES_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('Professores')
@Controller('professores')
export class ProfessoresGatewayController {
  constructor(
    @Inject(PROFESSORES_SERVICE_TOKEN)
    private readonly professoresClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Cria um professor',
    description:
      'Liga a um utilizador existente pelo `usuarioId` (id devolvido por POST /users). Titulação opcional.',
  })
  @ApiResponse({ status: 201, description: 'Professor criado' })
  @ApiResponse({
    status: 400,
    description:
      'Corpo inválido ou utilizador inexistente (referência inválida).',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe professor associado a este utilizador.',
  })
  @Post()
  create(@Body() dto: CreateProfessorDto) {
    return sendRpc(this.professoresClient, PROFESSOR_MSG.create, dto);
  }

  @ApiOperation({ summary: 'Lista professores' })
  @Get()
  findAll() {
    return sendRpc(this.professoresClient, PROFESSOR_MSG.findAll, {});
  }

  @ApiOperation({ summary: 'Obtém professor por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Professor não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(this.professoresClient, PROFESSOR_MSG.findOne, +id);
  }

  @ApiOperation({ summary: 'Atualiza professor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 404,
    description: 'Professor ou utilizador (usuarioId) não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Professor já associado ao utilizador indicado',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfessorDto) {
    return sendRpc(this.professoresClient, PROFESSOR_MSG.update, {
      id: +id,
      dto,
    });
  }

  @ApiOperation({ summary: 'Remove professor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Professor não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(this.professoresClient, PROFESSOR_MSG.remove, +id);
  }
}
