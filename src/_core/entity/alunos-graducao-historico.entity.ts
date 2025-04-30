import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alunos } from './alunos.entity';
import { Graduacoes } from './graduacoes.entity';
import { Modalidades } from './modalidades.entity';

@Entity()
export class AlunosGraducaoHistorico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  instrutor?: string;

  @Column({
    nullable: true,
  })
  grau?: number;

  @Column({
    nullable: true,
  })
  observacao?: string;

  @CreateDateColumn()
  dataHora: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Graduacoes, (graduacao) => graduacao.alunosGraducoes, {
    nullable: true,
  })
  graduacao: Graduacoes;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.alunosGraducoes)
  modalidade: Modalidades;

  @ManyToOne(() => Alunos, (aluno) => aluno.alunosGraducaoHistorico)
  aluno: Alunos;
}
