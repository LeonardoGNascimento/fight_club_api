import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

  // Relacionamento com Modalidades
  @ManyToOne(() => Modalidades, (modalidade) => modalidade.Turmas)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  // Relacionamento com AlunosGraducao
  @OneToMany(() => AlunosGraducao, (alunoGraduacao) => alunoGraduacao.turmas)
  alunosGraducoes: AlunosGraducao[];
}
