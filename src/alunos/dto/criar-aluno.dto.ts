import { User } from "src/_core/interfaces/user.interface";

export interface CreateAlunoDto {
  nome: string;
  cpf: string;
  cep: string;
  cidade: string;
  estado: string;
  rua: string;
  numero: string;
  modalidades: string[];
  plano: string;
  telefone: string;
  academiaId: string;
  clienteId: string;
  user: User,
}
