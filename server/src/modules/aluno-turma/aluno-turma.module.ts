import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  alunoTurmaCommandHandlers,
  alunoTurmaQueryHandlers,
} from './aluno-turma.cqrs';
import { AlunoTurmaService } from './aluno-turma.service';

@Module({
  imports: [CqrsModule],
  providers: [
    AlunoTurmaService,
    ...alunoTurmaCommandHandlers,
    ...alunoTurmaQueryHandlers,
  ],
  exports: [CqrsModule, AlunoTurmaService],
})
export class AlunoTurmaModule {}
