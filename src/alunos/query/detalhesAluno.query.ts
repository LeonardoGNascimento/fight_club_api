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

export class DetalhesAlunosQuery extends Alunos {
  plano: Planos;
  modalidades: Modalidades[];

  constructor(data?: Alunos) {
    super();

    if (data) {
      this.id = data.id;
      this.dataHora = data.dataHora;
      this.nome = data.nome;
      this.cpf = data.cpf;
      this.telefone = data.telefone;
      this.cep = data.cep;
      this.cidade = data.cidade;
      this.estado = data.estado;
      this.rua = data.rua;
      this.numero = data.numero;

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
