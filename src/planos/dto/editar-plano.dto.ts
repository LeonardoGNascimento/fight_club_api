import { IsNotEmpty } from 'class-validator';

export class EditarPlanoDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  valor: string;

  academiaId: string;
}
