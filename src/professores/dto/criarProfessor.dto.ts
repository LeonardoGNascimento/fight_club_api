export class CriarProfessorDto {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
  email: string;
  telefone: string;
  telefoneResidencial?: string;
  nascimento: Date | string;
  status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'DEVENDO';
  academiaId?: string;
}
