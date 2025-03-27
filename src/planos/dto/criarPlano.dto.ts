import { IsNotEmpty } from 'class-validator';

export class CriarPlanoDto {
  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  valor: string;

  academiaId: string;
}
