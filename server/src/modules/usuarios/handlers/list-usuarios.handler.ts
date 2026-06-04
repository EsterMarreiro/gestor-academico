import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsuariosService } from '../usuarios.service';
import { ListUsuariosQuery } from '../queries/impl/list-usuarios.query';

@QueryHandler(ListUsuariosQuery)
export class ListUsuariosHandler implements IQueryHandler<ListUsuariosQuery> {
  constructor(private readonly usuariosService: UsuariosService) {}

  execute() {
    return this.usuariosService.findAll();
  }
}
