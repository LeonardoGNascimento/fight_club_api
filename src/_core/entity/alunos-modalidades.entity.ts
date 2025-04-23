import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alunos } from './alunos.entity';
import { Graduacoes } from './graduacoes.entity';
import { Modalidades } from './modalidades.entity';
import { Turmas } from './turmas.entity';

@Entity()
export class AlunosModalidades {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Alunos, (aluno) => aluno.alunosGraduacoes)
  aluno: Alunos;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.alunosModalidades)
  modalidade: Modalidades;

  @ManyToOne(() => Graduacoes, (graduacoes) => graduacoes.alunosModalidades, {
    nullable: true,
  })
  graduacao?: Graduacoes;

  @ManyToOne(() => Turmas, (turma) => turma.alunosModalidades, {
    nullable: true,
  })
  turma?: Turmas;
}
