import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { DisciplinaService } from './disciplina.service';

export class CreateDisciplinaCommand {
  constructor(public readonly dto: CreateDisciplinaDto) {}
}

export class UpdateDisciplinaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDisciplinaDto,
  ) {}
}

export class RemoveDisciplinaCommand {
  constructor(public readonly id: number) {}
}

export class GetDisciplinaByIdQuery {
  constructor(public readonly id: number) {}
}

export class ListDisciplinasQuery {}

@CommandHandler(CreateDisciplinaCommand)
export class CreateDisciplinaHandler implements ICommandHandler<CreateDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: CreateDisciplinaCommand) {
    return this.disciplinaService.create(command.dto);
  }
}

@CommandHandler(UpdateDisciplinaCommand)
export class UpdateDisciplinaHandler implements ICommandHandler<UpdateDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: UpdateDisciplinaCommand) {
    return this.disciplinaService.update(command.id, command.dto);
  }
}

@CommandHandler(RemoveDisciplinaCommand)
export class RemoveDisciplinaHandler implements ICommandHandler<RemoveDisciplinaCommand> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(command: RemoveDisciplinaCommand) {
    return this.disciplinaService.remove(command.id);
  }
}

@QueryHandler(GetDisciplinaByIdQuery)
export class GetDisciplinaByIdHandler implements IQueryHandler<GetDisciplinaByIdQuery> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute(query: GetDisciplinaByIdQuery) {
    return this.disciplinaService.findOne(query.id);
  }
}

@QueryHandler(ListDisciplinasQuery)
export class ListDisciplinasHandler implements IQueryHandler<ListDisciplinasQuery> {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  execute() {
    return this.disciplinaService.findAll();
  }
}

export const disciplinaCommandHandlers = [
  CreateDisciplinaHandler,
  UpdateDisciplinaHandler,
  RemoveDisciplinaHandler,
];

export const disciplinaQueryHandlers = [
  GetDisciplinaByIdHandler,
  ListDisciplinasHandler,
];
