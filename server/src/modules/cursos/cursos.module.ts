import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';

@Module({
  providers: [CursosService],
  exports: [CursosService],
})
export class CursosModule {}
