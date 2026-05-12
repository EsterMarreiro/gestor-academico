import { Module } from '@nestjs/common';
import { DisciplinaModule } from './disciplina.module';
import { DisciplinaTcpController } from './disciplina.tcp.controller';

@Module({
  imports: [DisciplinaModule],
  controllers: [DisciplinaTcpController],
})
export class DisciplinaMicroserviceModule {}
