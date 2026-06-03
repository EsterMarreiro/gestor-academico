import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  inscricaoProfessorCommandHandlers,
  inscricaoProfessorQueryHandlers,
} from './inscricao-professor.cqrs';
import { InscricaoProfessorService } from './inscricao-professor.service';

@Module({
  imports: [CqrsModule],
  providers: [
    InscricaoProfessorService,
    ...inscricaoProfessorCommandHandlers,
    ...inscricaoProfessorQueryHandlers,
  ],
  exports: [CqrsModule, InscricaoProfessorService],
})
export class InscricaoProfessorModule {}
