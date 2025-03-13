import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Modalidades } from './modalidades.entity';
import { AlunosGraducao } from './alunos-graducao.entity'; // Relacionamento com Modalidades

@Entity('Graduacoes')
export class Graduacoes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'int', nullable: true })
  qtdGraus: number;

  @Column({ type: 'int', default: 0 })
  ordem: number;

  @Column()
  modalidadesId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Modalidades
  @ManyToOne(() => Modalidades, (modalidade) => modalidade.graduacoes)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  // Relacionamento com AlunosGraducao
  @OneToMany(() => AlunosGraducao, (alunosGraducao) => alunosGraducao.graduacao)
  alunosGraducoes: AlunosGraducao[];
}
