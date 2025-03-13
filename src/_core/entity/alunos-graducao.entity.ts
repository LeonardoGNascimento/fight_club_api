import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Alunos } from './alunos.entity';
import { Modalidades } from './modalidades.entity';
import { Turmas } from './turmas.entity';
import { Graduacoes } from './graduacoes.entity';

@Entity('AlunosGraducao')
export class AlunosGraducao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alunosId: string;

  @Column({ nullable: true })
  graduacoesId: string;

  @Column()
  modalidadesId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  @Column({ nullable: true })
  turmasId: string;

  // Relacionamento com Turmas
  @ManyToOne(() => Turmas, (turma) => turma.alunosGraducoes, { nullable: true })
  @JoinColumn({ name: 'turmasId' })
  turmas: Turmas;

  // Relacionamento com Graduacoes
  @ManyToOne(() => Graduacoes, (graduacao) => graduacao.alunosGraducoes, { nullable: true })
  @JoinColumn({ name: 'graduacoesId' })
  graduacao: Graduacoes;

  // Relacionamento com Modalidades
  @ManyToOne(() => Modalidades, (modalidade) => modalidade.alunosGraducoes)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  // Relacionamento com Alunos
  @ManyToOne(() => Alunos, (aluno) => aluno.alunosGraducoes)
  @JoinColumn({ name: 'alunosId' })
  aluno: Alunos;
}
