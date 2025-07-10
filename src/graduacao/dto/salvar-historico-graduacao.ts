export interface SalvarHistoricoGraduacao {
  grau?: number | null;
  alunoId: string;
  modalidadeId: string;
  graduacaoId: string;

  instrutor?: string;
  observacao?: string;
}
