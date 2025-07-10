import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExamesGraducaoAlunos } from './exames-graducao-alunos.entity'; // Relacionamento com AlunosExamesGraducao
import { Modalidades } from './modalidades.entity'; // Relacionamento com Modalidades

export enum StatusExame {
  agendado = 'agendado',
  emProgresso = 'emProgresso',
  finalizado = 'finalizado',
}
@Entity()
export class ExamesGraduacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'datetime' })
  dataAgendamento: Date;

  @Column({ type: 'enum', enum: StatusExame, default: StatusExame.agendado })
  status: StatusExame;

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
