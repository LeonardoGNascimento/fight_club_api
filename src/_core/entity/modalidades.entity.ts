import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { Agendas } from './agendas.entity';
import { AlunosGraducao } from './alunos-graducao.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';
import { Graduacoes } from './graduacoes.entity';
import { Turmas } from './turmas.entity';

@Entity()
export class Modalidades {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Academias, (academia) => academia.modalidades)
  academia: Academias;

  @OneToMany(() => Agendas, (agenda) => agenda.modalidade)
  agendas: Agendas[];

  @OneToMany(
    () => ExamesGraduacao,
    (exameGraduacao) => exameGraduacao.modalidade,
  )
  examesGraduacoes: ExamesGraduacao[];

  @OneToMany(() => Graduacoes, (graduacao) => graduacao.modalidade)
  graduacoes: Graduacoes[];

  @OneToMany(
    () => AlunosGraducao,
    (alunoGraduacao) => alunoGraduacao.modalidade,
  )
  alunosGraducoes: AlunosGraducao[];

  @OneToMany(() => Turmas, (turma) => turma.modalidade)
  Turmas: Turmas[];
}
