import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDisciplinaDto {
  @ApiProperty({ description: 'Nome da disciplina' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição da disciplina' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Identificador do curso ao qual a disciplina pertence' })
  @IsInt({ message: 'cursoId deve ser um inteiro' })
  cursoId: number;

  @ApiPropertyOptional({
    description: 'Identificador do professor responsável (opcional)',
  })
  @IsOptional()
  @IsInt({ message: 'professorId deve ser um inteiro' })
  professorId?: number;
}
