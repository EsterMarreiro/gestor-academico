import { Module } from '@nestjs/common';
import { AlunoModule } from './aluno.module';
import { AlunoTcpController } from './aluno.tcp.controller';

@Module({
  imports: [AlunoModule],
  controllers: [AlunoTcpController],
})
export class AlunoMicroserviceModule {}
