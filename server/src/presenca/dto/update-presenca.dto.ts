import { PartialType } from '@nestjs/swagger';
import { CreatePresencaDto } from './create-presenca.dto';

export class UpdatePresencaDto extends PartialType(CreatePresencaDto) {}
