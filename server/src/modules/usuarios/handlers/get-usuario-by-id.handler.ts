import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsuariosService } from '../usuarios.service';
import { GetUsuarioByIdQuery } from '../queries/impl/get-usuario-by-id.query';

@QueryHandler(GetUsuarioByIdQuery)
export class GetUsuarioByIdHandler implements IQueryHandler<GetUsuarioByIdQuery> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute(query: GetUsuarioByIdQuery) {
    return this.usuariosService.findOne(query.id);
  }
}
