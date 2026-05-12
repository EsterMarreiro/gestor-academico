import { Module } from '@nestjs/common';
import { AulaService } from './aula.service';

@Module({
  providers: [AulaService],
  exports: [AulaService],
})
export class AulaModule {}
