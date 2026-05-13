import { Module } from '@nestjs/common';
import { ProfessorModule } from './professor.module';
import { ProfessorTcpController } from './professor.tcp.controller';

@Module({
  imports: [ProfessorModule],
  controllers: [ProfessorTcpController],
})
export class ProfessorMicroserviceModule {}
