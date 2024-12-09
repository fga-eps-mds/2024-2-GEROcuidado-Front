import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  // TODO colocar mensagens customizadas "user friendly" em todos os validators

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @MinLength(5)
  nome!: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  senha!: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;
}
