import { PartialType } from '@nestjs/mapped-types';
import { CreateCursosDto } from './create-cursos.dto';

export class UpdateCursosDto extends PartialType(CreateCursosDto) {}
