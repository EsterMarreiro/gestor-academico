import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';

@Module({
  providers: [MatriculaService],
  exports: [MatriculaService],
})
export class MatriculaModule {}
