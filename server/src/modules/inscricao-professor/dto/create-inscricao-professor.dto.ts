import { StatusInscricaoProfessor } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInscricaoProfessorDto {
  @ApiProperty({ description: 'Identificador do usuário solicitante' })
  @Type(() => Number)
  @IsDefined({ message: 'usuarioId é obrigatório' })
  @IsInt({ message: 'usuarioId deve ser um inteiro' })
  @Min(1, { message: 'usuarioId deve ser positivo' })
  usuarioId: number;

  @ApiProperty({ description: 'Identificador da disciplina desejada' })
  @Type(() => Number)
  @IsDefined({ message: 'disciplinaId é obrigatório' })
  @IsInt({ message: 'disciplinaId deve ser um inteiro' })
  @Min(1, { message: 'disciplinaId deve ser positivo' })
  disciplinaId: number;

  @ApiPropertyOptional({
    description: 'Status da inscrição do professor',
    enum: StatusInscricaoProfessor,
    default: StatusInscricaoProfessor.pendente,
  })
  @IsOptional()
  @IsEnum(StatusInscricaoProfessor, { message: 'status inválido' })
  status?: StatusInscricaoProfessor;
}
