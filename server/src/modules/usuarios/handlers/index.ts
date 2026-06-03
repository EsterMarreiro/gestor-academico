export { CreateUsuarioHandler } from './create-usuario.handler';
export { GetUsuarioByIdHandler } from './get-usuario-by-id.handler';
export { ListUsuariosHandler } from './list-usuarios.handler';
export { RemoveUsuarioHandler } from './remove-usuario.handler';
export { UpdateUsuarioHandler } from './update-usuario.handler';

import { CreateUsuarioHandler } from './create-usuario.handler';
import { GetUsuarioByIdHandler } from './get-usuario-by-id.handler';
import { ListUsuariosHandler } from './list-usuarios.handler';
import { RemoveUsuarioHandler } from './remove-usuario.handler';
import { UpdateUsuarioHandler } from './update-usuario.handler';

export const usuariosCommandHandlers = [
  CreateUsuarioHandler,
  UpdateUsuarioHandler,
  RemoveUsuarioHandler,
];

export const usuariosQueryHandlers = [
  GetUsuarioByIdHandler,
  ListUsuariosHandler,
];
