import { IsNotEmpty, IsNumberString } from 'class-validator';

export class IdValidator {
  @IsNumberString('', { message: 'ID inválido' })
  @IsNotEmpty({ message: 'ID vazio' })
  id!: number;
}
