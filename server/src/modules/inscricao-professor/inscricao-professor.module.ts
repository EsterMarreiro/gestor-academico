import { Module } from '@nestjs/common';
import { InscricaoProfessorService } from './inscricao-professor.service';

@Module({
  providers: [InscricaoProfessorService],
  exports: [InscricaoProfessorService],
})
export class InscricaoProfessorModule {}
