import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlunosGraducao } from './alunos-graducao.entity';
import { Modalidades } from './modalidades.entity';

@Entity()
export class Turmas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.Turmas)
  modalidade: Modalidades;

  @OneToMany(() => AlunosGraducao, (alunoGraduacao) => alunoGraduacao.turmas)
  alunosGraducoes: AlunosGraducao[];
}
