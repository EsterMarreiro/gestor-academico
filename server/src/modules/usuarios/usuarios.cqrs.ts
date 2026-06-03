export { CreateUsuarioCommand } from './commands/impl/create-usuario.command';
export { UpdateUsuarioCommand } from './commands/impl/update-usuario.command';
export { RemoveUsuarioCommand } from './commands/impl/remove-usuario.command';
export { GetUsuarioByIdQuery } from './queries/impl/get-usuario-by-id.query';
export { ListUsuariosQuery } from './queries/impl/list-usuarios.query';
import { CreateUsuarioHandler } from './handlers/create-usuario.handler';
import { GetUsuarioByIdHandler } from './handlers/get-usuario-by-id.handler';
import { ListUsuariosHandler } from './handlers/list-usuarios.handler';
import { RemoveUsuarioHandler } from './handlers/remove-usuario.handler';
import { UpdateUsuarioHandler } from './handlers/update-usuario.handler';

export const usuariosCommandHandlers = [
  CreateUsuarioHandler,
  UpdateUsuarioHandler,
  RemoveUsuarioHandler,
];

export const usuariosQueryHandlers = [
  GetUsuarioByIdHandler,
  ListUsuariosHandler,
];
