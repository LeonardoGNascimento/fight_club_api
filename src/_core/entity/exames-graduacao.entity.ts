import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity'; // Relacionamento com Academias
import { ExamesGraducaoAlunos } from './exames-graducao-alunos.entity'; // Relacionamento com AlunosExamesGraducao
import { Modalidades } from './modalidades.entity'; // Relacionamento com Modalidades

@Entity()
export class ExamesGraduacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'datetime' })
  dataAgendamento: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.examesGraduacoes)
  modalidade: Modalidades;

  @OneToMany(
    () => ExamesGraducaoAlunos,
    (alunoExame) => alunoExame.examesGraduacao,
  )
  alunosExamesGraducoes: ExamesGraducaoAlunos[];
}
