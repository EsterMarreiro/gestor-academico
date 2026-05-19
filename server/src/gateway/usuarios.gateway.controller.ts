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
import { USER_MSG } from '../contracts/microservice-patterns';
import { CreateUsuarioDto } from '../modules/usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../modules/usuarios/dto/update-usuario.dto';
import { USERS_SERVICE_TOKEN } from './gateway-tokens';
import { sendRpc } from './microservice-rpc.helper';

@ApiTags('Usuários')
@Controller('users')
export class UsuariosGatewayController {
  constructor(
    @Inject(USERS_SERVICE_TOKEN) private readonly usersClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Encaminhado ao microserviço de usuários via API Gateway.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return sendRpc(this.usersClient, USER_MSG.create, createUsuarioDto);
  }

  @ApiOperation({
    summary: 'Lista todos os usuários',
    description: 'Encaminhado ao microserviço de usuários via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todos os usuários foram retornados com sucesso.',
  })
  @Get()
  findAll() {
    return sendRpc(this.usersClient, USER_MSG.findAll, {});
  }

  @ApiOperation({
    summary: 'Lista os dados de um usuário específico',
    description: 'Encaminhado ao microserviço de usuários via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return sendRpc(this.usersClient, USER_MSG.findOne, +id);
  }

  @ApiOperation({
    summary: 'Atualiza os dados de um usuário específico',
    description: 'Encaminhado ao microserviço de usuários via API Gateway.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return sendRpc(this.usersClient, USER_MSG.update, {
      id: +id,
      dto: updateUsuarioDto,
    });
  }

  @ApiOperation({
    summary: 'Deleta um usuário específico',
    description: 'Encaminhado ao microserviço de usuários via API Gateway.',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return sendRpc(this.usersClient, USER_MSG.remove, +id);
  }
}
