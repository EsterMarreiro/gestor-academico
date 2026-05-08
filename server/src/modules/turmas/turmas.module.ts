import { Module } from '@nestjs/common';
import { TurmasService } from './turmas.service';

@Module({
  providers: [TurmasService],
  exports: [TurmasService],
})
export class TurmasModule {}
