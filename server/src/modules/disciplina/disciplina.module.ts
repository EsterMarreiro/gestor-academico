import { Module } from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';

@Module({
  providers: [DisciplinaService],
  exports: [DisciplinaService],
})
export class DisciplinaModule {}
