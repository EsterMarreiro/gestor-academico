import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { CreateCursosDto } from './dto/create-cursos.dto';
import { UpdateCursosDto } from './dto/update-cursos.dto';
import { CursosService } from './cursos.service';

export class CreateCursoCommand {
  constructor(public readonly dto: CreateCursosDto) {}
}

export class UpdateCursoCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCursosDto,
  ) {}
}

export class RemoveCursoCommand {
  constructor(public readonly id: number) {}
}

export class GetCursoByIdQuery {
  constructor(public readonly id: number) {}
}

export class ListCursosQuery {}

@CommandHandler(CreateCursoCommand)
export class CreateCursoHandler implements ICommandHandler<CreateCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: CreateCursoCommand) {
    return this.cursosService.create(command.dto);
  }
}

@CommandHandler(UpdateCursoCommand)
export class UpdateCursoHandler implements ICommandHandler<UpdateCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: UpdateCursoCommand) {
    return this.cursosService.update(command.id, command.dto);
  }
}

@CommandHandler(RemoveCursoCommand)
export class RemoveCursoHandler implements ICommandHandler<RemoveCursoCommand> {
  constructor(private readonly cursosService: CursosService) {}

  execute(command: RemoveCursoCommand) {
    return this.cursosService.remove(command.id);
  }
}

@QueryHandler(GetCursoByIdQuery)
export class GetCursoByIdHandler
  implements IQueryHandler<GetCursoByIdQuery>
{
  constructor(private readonly cursosService: CursosService) {}

  execute(query: GetCursoByIdQuery) {
    return this.cursosService.findOne(query.id);
  }
}

@QueryHandler(ListCursosQuery)
export class ListCursosHandler implements IQueryHandler<ListCursosQuery> {
  constructor(private readonly cursosService: CursosService) {}

  execute() {
    return this.cursosService.findAll();
  }
}

export const cursosCommandHandlers = [
  CreateCursoHandler,
  UpdateCursoHandler,
  RemoveCursoHandler,
];

export const cursosQueryHandlers = [GetCursoByIdHandler, ListCursosHandler];
