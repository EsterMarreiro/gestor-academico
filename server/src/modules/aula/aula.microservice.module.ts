import { Module } from '@nestjs/common';
import { AulaModule } from './aula.module';
import { AulaTcpController } from './aula.tcp.controller';

@Module({
  imports: [AulaModule],
  controllers: [AulaTcpController],
})
export class AulaMicroserviceModule {}
