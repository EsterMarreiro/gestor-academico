import { PartialType } from '@nestjs/mapped-types';
import { CreateAlunoTurmaDto } from './create-aluno-turma.dto';

export class UpdateAlunoTurmaDto extends PartialType(CreateAlunoTurmaDto) {}
