import { IsNotEmpty, IsString } from 'class-validator';

export class CriarTurmaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  modalidadeId: string;
}
