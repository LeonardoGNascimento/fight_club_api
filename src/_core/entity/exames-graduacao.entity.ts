import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Academias } from './academias.entity'; // Relacionamento com Academias
import { Modalidades } from './modalidades.entity'; // Relacionamento com Modalidades
import { AlunosExamesGraducao } from './alunos-exames-graducao.entity'; // Relacionamento com AlunosExamesGraducao

@Entity('ExamesGraduacao')
export class ExamesGraduacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modalidadesId: string;

  @Column()
  academiasId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.examesGraduacoes)
  @JoinColumn({ name: 'academiasId' })
  academia: Academias;

  // Relacionamento com Modalidades
  @ManyToOne(() => Modalidades, (modalidade) => modalidade.examesGraduacoes)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  // Relacionamento com AlunosExamesGraducao
  @OneToMany(() => AlunosExamesGraducao, (alunoExame) => alunoExame.examesGraduacao)
  alunosExamesGraducoes: AlunosExamesGraducao[];
}
