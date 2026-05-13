import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmasService } from './turmas.service';

export class CreateTurmaCommand {
  constructor(public readonly dto: CreateTurmaDto) {}
}

export class UpdateTurmaCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateTurmaDto,
  ) {}
}

export class RemoveTurmaCommand {
  constructor(public readonly id: number) {}
}

export class GetTurmaByIdQuery {
  constructor(public readonly id: number) {}
}

export class ListTurmasQuery {}

@CommandHandler(CreateTurmaCommand)
export class CreateTurmaHandler implements ICommandHandler<CreateTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: CreateTurmaCommand) {
    return this.turmasService.create(command.dto);
  }
}

@CommandHandler(UpdateTurmaCommand)
export class UpdateTurmaHandler implements ICommandHandler<UpdateTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: UpdateTurmaCommand) {
    return this.turmasService.update(command.id, command.dto);
  }
}

@CommandHandler(RemoveTurmaCommand)
export class RemoveTurmaHandler implements ICommandHandler<RemoveTurmaCommand> {
  constructor(private readonly turmasService: TurmasService) {}

  execute(command: RemoveTurmaCommand) {
    return this.turmasService.remove(command.id);
  }
}

@QueryHandler(GetTurmaByIdQuery)
export class GetTurmaByIdHandler
  implements IQueryHandler<GetTurmaByIdQuery>
{
  constructor(private readonly turmasService: TurmasService) {}

  execute(query: GetTurmaByIdQuery) {
    return this.turmasService.findOne(query.id);
  }
}

@QueryHandler(ListTurmasQuery)
export class ListTurmasHandler implements IQueryHandler<ListTurmasQuery> {
  constructor(private readonly turmasService: TurmasService) {}

  execute() {
    return this.turmasService.findAll();
  }
}

export const turmasCommandHandlers = [
  CreateTurmaHandler,
  UpdateTurmaHandler,
  RemoveTurmaHandler,
];

export const turmasQueryHandlers = [GetTurmaByIdHandler, ListTurmasHandler];
