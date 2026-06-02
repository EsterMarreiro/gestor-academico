import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(4, 20, { message: 'A senha deve ter entre 4 e 20 caracteres' })
  senha: string;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  telefone: string;

  @ApiProperty({
    description: 'Data de nascimento do usuário (formato ISO 8601)',
  })
  @Transform(({ value }: TransformFnParams) => {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Data de nascimento inválida' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  dataNascimento: Date;

  @ApiProperty({ description: 'CEP do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  cep: string;

  @ApiProperty({ description: 'Estado do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  estado: string;

  @ApiProperty({ description: 'Cidade do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  cidade: string;

  @ApiProperty({ description: 'Rua do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  rua: string;

  @ApiProperty({ description: 'Número do endereço do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  numero: string;

  @ApiPropertyOptional({ description: 'Complemento do endereço do usuário' })
  @IsString()
  @IsOptional()
  complemento?: string;

  //   @ApiProperty({ description: 'Tipo do usuário', enum: TipoUsuario })
  //   @IsEnum(TipoUsuario, { message: 'Tipo de usuário inválido' })
  //   @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  //   tipoUsuario: TipoUsuario;
}
