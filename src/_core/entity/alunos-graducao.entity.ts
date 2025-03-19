import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alunos } from './alunos.entity';
import { Graduacoes } from './graduacoes.entity';
import { Modalidades } from './modalidades.entity';
import { Turmas } from './turmas.entity';

@Entity()
export class AlunosGraducao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Turmas, (turma) => turma.alunosGraducoes, { nullable: true })
  turmas: Turmas;

  @ManyToOne(() => Graduacoes, (graduacao) => graduacao.alunosGraducoes, {
    nullable: true,
  })
  graduacao: Graduacoes;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.alunosGraducoes)
  modalidade: Modalidades;

  @ManyToOne(() => Alunos, (aluno) => aluno.alunosGraducoes)
  aluno: Alunos;
}
