import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificacaoDto {
  @ApiProperty({
    example: 'Atualização de matrícula',
    description: 'Título da notificação',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    example: 'Sua matrícula foi aprovada com sucesso.',
    description: 'Conteúdo ou mensagem da notificação',
  })
  @IsString()
  @IsNotEmpty()
  mensagem: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID do usuário destinatário',
  })
  @IsOptional()
  @IsInt()
  usuarioId?: number;
}
