import { AlunosModalidades } from 'src/_core/entity/alunos-modalidades.entity';
import { Alunos } from 'src/_core/entity/alunos.entity';
import { Planos } from 'src/_core/entity/planos.entity';

interface AlunosGraducaoHistorico {
  id: string;
  dataHora: Date;
  nome: string;
  instrutor?: string;
  observacao?: string;
  grau?: number;
}

interface Modalidades extends AlunosModalidades {
  historico: AlunosGraducaoHistorico[];
}

export class DetalhesAlunosQuery {
  id: string;
  dataHora: Date;
  nome: string;
  plano: Planos;
  modalidades: Modalidades[];

  constructor(data?: Alunos) {
    if (data) {
      this.id = data.id;
      this.dataHora = data.dataHora;
      this.nome = data.nome;

      if (data.alunosModalidades) {
        this.setModalidades(data.alunosModalidades);
      }
    }
  }

  setModalidades(modalidades: AlunosModalidades[]) {
    this.modalidades = modalidades.map((item) => ({
      ...item,
      historico: [],
    }));
  }

  addHistoricoGraduacao(
    historico: AlunosGraducaoHistorico,
    modalidadeId: string,
  ) {
    this.modalidades
      .find((item) => item.modalidade.id === modalidadeId)
      .historico.push(historico);
  }
}
