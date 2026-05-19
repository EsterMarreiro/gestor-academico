import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ description: 'Identificador da turma' })
  @IsInt({ message: 'turmaId deve ser um inteiro' })
  @Min(1, { message: 'turmaId inválido' })
  turmaId: number;

  @ApiPropertyOptional({ description: 'Título da aula' })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ description: 'Data e hora de início (ISO 8601)' })
  @IsDateString({}, { message: 'dataInicio inválida' })
  @IsNotEmpty({ message: 'dataInicio é obrigatória' })
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  dataInicio: Date;

  @ApiPropertyOptional({ description: 'Data e hora de fim (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'dataFim inválida' })
  @Transform(({ value }: TransformFnParams) =>
    value == null || value === ''
      ? undefined
      : typeof value === 'string'
        ? new Date(value)
        : value,
  )
  dataFim?: Date;

  @ApiPropertyOptional({ description: 'Conteúdo ou notas da aula' })
  @IsString()
  @IsOptional()
  conteudo?: string;
}
