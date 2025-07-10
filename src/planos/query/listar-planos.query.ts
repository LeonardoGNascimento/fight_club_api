export interface ListarPlanosQuery {
  id: string;
  dataHora: Date;
  nome: string;
  descricao: string;
  valor: string;
  deleted: Date;
  totalAlunos: number;
}
