import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Academias } from './academias.entity';
import { Agendas } from './agendas.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';
import { Graduacoes } from './graduacoes.entity';
import { AlunosGraducao } from './alunos-graducao.entity';
import { Turmas } from './turmas.entity';

@Entity('Modalidades')
export class Modalidades {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  academiasId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.modalidades)
  @JoinColumn({ name: 'academiasId' })
  academia: Academias;

  // Relacionamento com Agendas
  @OneToMany(() => Agendas, (agenda) => agenda.modalidade)
  agendas: Agendas[];

  // Relacionamento com ExamesGraduacao
  @OneToMany(() => ExamesGraduacao, (exameGraduacao) => exameGraduacao.modalidade)
  examesGraduacoes: ExamesGraduacao[];

  // Relacionamento com Graduacoes
  @OneToMany(() => Graduacoes, (graduacao) => graduacao.modalidade)
  graduacoes: Graduacoes[];

  // Relacionamento com AlunosGraducao
  @OneToMany(() => AlunosGraducao, (alunoGraduacao) => alunoGraduacao.modalidade)
  alunosGraducoes: AlunosGraducao[];

  // Relacionamento com Turmas
  @OneToMany(() => Turmas, (turma) => turma.modalidade)
  Turmas: Turmas[];
}
