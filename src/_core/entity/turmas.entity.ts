import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Modalidades } from './modalidades.entity';
import { AlunosGraducao } from './alunos-graducao.entity';

@Entity('Turmas')
export class Turmas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  modalidadesId: string;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.Turmas)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  @OneToMany(() => AlunosGraducao, (alunoGraduacao) => alunoGraduacao.turmas)
  alunosGraducoes: AlunosGraducao[];
}
