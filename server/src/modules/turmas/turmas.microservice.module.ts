import { Module } from '@nestjs/common';
import { TurmasModule } from './turmas.module';
import { TurmasTcpController } from './turmas.tcp.controller';

@Module({
  imports: [TurmasModule],
  controllers: [TurmasTcpController],
})
export class TurmasMicroserviceModule {}
