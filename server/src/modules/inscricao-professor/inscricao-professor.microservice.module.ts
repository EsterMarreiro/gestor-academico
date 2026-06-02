import { Module } from '@nestjs/common';
import { InscricaoProfessorModule } from './inscricao-professor.module';
import { InscricaoProfessorTcpController } from './inscricao-professor.tcp.controller';

@Module({
  imports: [InscricaoProfessorModule],
  controllers: [InscricaoProfessorTcpController],
})
export class InscricaoProfessorMicroserviceModule {}
