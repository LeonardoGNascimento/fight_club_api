import { Status } from "src/_core/entity/professores.entity";

export class EditarProfessorDto {
  id: string;
  nome?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  estado?: string;
  cidade?: string;
  email?: string;
  telefone?: string;
  telefoneResidencial?: string;
  nascimento?: Date | string;
  status?: Status;
  academiaId?: string;
}