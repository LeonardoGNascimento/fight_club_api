import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alunos } from './alunos.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';

@Entity()
export class ExamesGraducaoAlunos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'boolean' })
  aprovado: boolean;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Alunos, (aluno) => aluno.alunosExamesGraducoes)
  aluno: Alunos;

  @ManyToOne(
    () => ExamesGraduacao,
    (exameGraduacao) => exameGraduacao.alunosExamesGraducoes,
  )
  examesGraduacao: ExamesGraduacao;
}
