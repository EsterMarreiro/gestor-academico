import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

export class CreateUsuarioCommand {
  constructor(public readonly dto: CreateUsuarioDto) {}
}

export class UpdateUsuarioCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUsuarioDto,
  ) {}
}

export class RemoveUsuarioCommand {
  constructor(public readonly id: number) {}
}

export class GetUsuarioByIdQuery {
  constructor(public readonly id: number) {}
}

export class ListUsuariosQuery {}

@CommandHandler(CreateUsuarioCommand)
export class CreateUsuarioHandler
  implements ICommandHandler<CreateUsuarioCommand>
{
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: CreateUsuarioCommand) {
    return this.usuariosService.create(command.dto);
  }
}

@CommandHandler(UpdateUsuarioCommand)
export class UpdateUsuarioHandler
  implements ICommandHandler<UpdateUsuarioCommand>
{
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: UpdateUsuarioCommand) {
    return this.usuariosService.update(command.id, command.dto);
  }
}

@CommandHandler(RemoveUsuarioCommand)
export class RemoveUsuarioHandler
  implements ICommandHandler<RemoveUsuarioCommand>
{
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(command: RemoveUsuarioCommand) {
    return this.usuariosService.remove(command.id);
  }
}

@QueryHandler(GetUsuarioByIdQuery)
export class GetUsuarioByIdHandler
  implements IQueryHandler<GetUsuarioByIdQuery>
{
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(query: GetUsuarioByIdQuery) {
    return this.usuariosService.findOne(query.id);
  }
}

@QueryHandler(ListUsuariosQuery)
export class ListUsuariosHandler implements IQueryHandler<ListUsuariosQuery> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute() {
    return this.usuariosService.findAll();
  }
}

export const usuariosCommandHandlers = [
  CreateUsuarioHandler,
  UpdateUsuarioHandler,
  RemoveUsuarioHandler,
];

export const usuariosQueryHandlers = [
  GetUsuarioByIdHandler,
  ListUsuariosHandler,
];
