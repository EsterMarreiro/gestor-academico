import { Module } from '@nestjs/common';
import { AlunoTurmaModule } from './aluno-turma.module';
import { AlunoTurmaTcpController } from './aluno-turma.tcp.controller';

@Module({
  imports: [AlunoTurmaModule],
  controllers: [AlunoTurmaTcpController],
})
export class AlunoTurmaMicroserviceModule {}
