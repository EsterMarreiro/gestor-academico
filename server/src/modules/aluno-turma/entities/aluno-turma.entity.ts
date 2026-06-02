import { ApiProperty } from '@nestjs/swagger';

export class AlunoTurmaEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  alunoId: number;

  @ApiProperty()
  turmaId: number;

  @ApiProperty()
  criadoEm: Date;

  @ApiProperty()
  atualizadoEm: Date;

  @ApiProperty({ nullable: true })
  deletadoEm: Date | null;
}
