export interface ListarAlunosDto {
  academiaId: string;
  query?: ListarAlunosQueryDto
}

export interface ListarAlunosQueryDto {
  modalidade?: string;
  plano?: string;
  status?: string;
}
