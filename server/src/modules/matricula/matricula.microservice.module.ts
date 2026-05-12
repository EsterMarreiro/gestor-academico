import { Module } from '@nestjs/common';
import { MatriculaModule } from './matricula.module';
import { MatriculaTcpController } from './matricula.tcp.controller';

@Module({
  imports: [MatriculaModule],
  controllers: [MatriculaTcpController],
})
export class MatriculaMicroserviceModule {}
