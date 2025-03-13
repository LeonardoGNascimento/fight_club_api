import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alunos } from './alunos.entity'; // Relacionamento com Alunos
import { ExamesGraduacao } from './exames-graduacao.entity'; // Relacionamento com ExamesGraduacao

@Entity('AlunosExamesGraducao')
export class AlunosExamesGraducao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examesGraduacaoId: string;

  @Column()
  alunosId: string;

  @Column({ type: 'boolean' })
  aprovado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Alunos
  @ManyToOne(() => Alunos, (aluno) => aluno.alunosExamesGraducoes)
  @JoinColumn({ name: 'alunosId' })
  aluno: Alunos;

  // Relacionamento com ExamesGraduacao
  @ManyToOne(() => ExamesGraduacao, (exameGraduacao) => exameGraduacao.alunosExamesGraducoes)
  @JoinColumn({ name: 'examesGraduacaoId' })
  examesGraduacao: ExamesGraduacao;
}
