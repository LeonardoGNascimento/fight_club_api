import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alunos } from './alunos.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';
import { StatusExame } from '../enum/status-exame';
import { Graduacoes } from './graduacoes.entity';

@Entity()
export class ExamesGraducaoAlunos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'enum', enum: StatusExame, default: StatusExame.emAndamento })
  status: StatusExame;

  @ManyToOne(
    () => Graduacoes,
    (exameGraduacao) => exameGraduacao.exameGraduacaoAtual,
  )
  graduacaoAtual: Graduacoes;

  @ManyToOne(
    () => Graduacoes,
    (exameGraduacao) => exameGraduacao.exameGraduacaoPretendida,
  )
  graduacaoPretendida: Graduacoes;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Alunos, (aluno) => aluno.alunosExamesGraducoes)
  aluno: Alunos;

  @ManyToOne(
    () => ExamesGraduacao,
    (exameGraduacao) => exameGraduacao.alunosExamesGraducoes,
  )
  examesGraduacao: ExamesGraduacao;
}
