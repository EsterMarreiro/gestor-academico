import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min } from 'class-validator';

export class CreateAlunoTurmaDto {
  @ApiProperty({ description: 'Identificador do aluno' })
  @Type(() => Number)
  @IsDefined({ message: 'alunoId é obrigatório' })
  @IsInt({ message: 'alunoId deve ser um inteiro' })
  @Min(1, { message: 'alunoId deve ser positivo' })
  alunoId: number;

  @ApiProperty({ description: 'Identificador da turma' })
  @Type(() => Number)
  @IsDefined({ message: 'turmaId é obrigatório' })
  @IsInt({ message: 'turmaId deve ser um inteiro' })
  @Min(1, { message: 'turmaId deve ser positivo' })
  turmaId: number;
}
