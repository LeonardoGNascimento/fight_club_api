export interface AtualizarGraduacaoDto {
  id: string;
  modalidadeId: string;
  graduacaoId: string;
  observacao?: string;
  instrutor?: string;
  grau?: number;
}
