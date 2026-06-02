import { Module } from '@nestjs/common';
import { AlunoTurmaService } from './aluno-turma.service';

@Module({
  providers: [AlunoTurmaService],
  exports: [AlunoTurmaService],
})
export class AlunoTurmaModule {}
