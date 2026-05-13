import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAlunoDto {
  @ApiProperty({
    description: 'Identificador do utilizador (ex.: id devolvido por POST /users).',
  })
  @Type(() => Number)
  @IsDefined({ message: 'usuarioId é obrigatório' })
  @IsInt({ message: 'usuarioId deve ser um inteiro' })
  @Min(1, { message: 'usuarioId deve ser positivo' })
  usuarioId: number;

  @ApiPropertyOptional({
    description:
      'Número de matrícula institucional (único). Se omitido, é gerado automaticamente.',
  })
  @IsString()
  @IsOptional()
  numeroMatricula?: string;
}
