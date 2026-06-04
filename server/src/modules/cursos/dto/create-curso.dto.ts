import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({ description: 'Nome do curso' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição do curso' })
  @IsString()
  @IsOptional()
  descricao?: string;
}
