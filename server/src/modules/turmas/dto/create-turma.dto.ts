import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateTurmaDto {
  @ApiProperty({ description: 'Código único da turma (ex.: T2025-ALG-01)' })
  @IsString()
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @MinLength(1, { message: 'O código não pode ser vazio' })
  codigo: string;

  @ApiProperty({ description: 'Identificador da disciplina' })
  @IsInt({ message: 'disciplinaId deve ser um inteiro' })
  @Min(1, { message: 'disciplinaId inválido' })
  disciplinaId: number;

  @ApiProperty({ description: 'Número total de vagas' })
  @IsInt({ message: 'vagasTotal deve ser um inteiro' })
  @Min(0, { message: 'vagasTotal não pode ser negativo' })
  vagasTotal: number;
}
