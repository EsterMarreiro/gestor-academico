import { Module } from '@nestjs/common';
import { CursosModule } from './cursos.module';
import { CursosTcpController } from './cursos.tcp.controller';

@Module({
  imports: [CursosModule],
  controllers: [CursosTcpController],
})
export class CursosMicroserviceModule {}
