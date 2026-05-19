import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusMatricula } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ description: 'Identificador do aluno' })
  @IsInt({ message: 'alunoId deve ser um inteiro' })
  alunoId: number;

  @ApiProperty({ description: 'Identificador do curso' })
  @IsInt({ message: 'cursoId deve ser um inteiro' })
  cursoId: number;

  @ApiPropertyOptional({
    description: 'Estado da matrícula',
    enum: StatusMatricula,
    default: StatusMatricula.pendente,
  })
  @IsOptional()
  @IsEnum(StatusMatricula, { message: 'status inválido' })
  status?: StatusMatricula;
}
