import { Turmas } from '../../_core/entity/turmas.entity';
import { Graduacoes } from '../../_core/entity/graduacoes.entity';
import { Modalidades } from '../../_core/entity/modalidades.entity';
import { Alunos } from '../../_core/entity/alunos.entity';

export interface ListarGraduacoesQuery {
  id: string;
  alunosId: string;
  graduacoesId: string;
  modalidadesId: string;
  turmasId: string;
  turmas: Turmas;
  graduacao: Graduacoes;
  modalidade: Modalidades;
  aluno: Alunos;
  grauInfo: { atual: number; total: number; qtdGraus: number; proxima: number }
}