import { PartialType } from '@nestjs/mapped-types';
import { CreateInscricaoProfessorDto } from './create-inscricao-professor.dto';

export class UpdateInscricaoProfessorDto extends PartialType(
  CreateInscricaoProfessorDto,
) {}
