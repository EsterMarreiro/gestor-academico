import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_MSG } from '../../contracts/microservice-patterns';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller()
export class UsuariosTcpController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @MessagePattern(USER_MSG.create)
  create(@Payload() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @MessagePattern(USER_MSG.findAll)
  findAll() {
    return this.usuariosService.findAll();
  }

  @MessagePattern(USER_MSG.findOne)
  findOne(@Payload() id: number) {
    return this.usuariosService.findOne(id);
  }

  @MessagePattern(USER_MSG.update)
  update(
    @Payload() payload: { id: number; dto: UpdateUsuarioDto },
  ) {
    return this.usuariosService.update(payload.id, payload.dto);
  }

  @MessagePattern(USER_MSG.remove)
  remove(@Payload() id: number) {
    return this.usuariosService.remove(id);
  }
}
