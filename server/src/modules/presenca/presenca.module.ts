import { Module } from '@nestjs/common';
import { PresencaService } from './presenca.service';
import { PresencaController } from './presenca.controller';

@Module({
  controllers: [PresencaController],
  providers: [PresencaService],
})
export class PresencaModule {}
