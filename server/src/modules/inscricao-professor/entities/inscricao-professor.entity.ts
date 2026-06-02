import { ApiProperty } from '@nestjs/swagger';
import { StatusInscricaoProfessor } from '@prisma/client';

export class InscricaoProfessorEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  usuarioId: number;

  @ApiProperty()
  disciplinaId: number;

  @ApiProperty({ enum: StatusInscricaoProfessor })
  status: StatusInscricaoProfessor;

  @ApiProperty()
  criadoEm: Date;

  @ApiProperty()
  atualizadoEm: Date;

  @ApiProperty({ nullable: true })
  deletadoEm: Date | null;
}
