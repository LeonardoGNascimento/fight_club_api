import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity'; // Relacionamento com Academias
import { AlunosExamesGraducao } from './alunos-exames-graducao.entity'; // Relacionamento com AlunosExamesGraducao
import { Modalidades } from './modalidades.entity'; // Relacionamento com Modalidades

@Entity()
export class ExamesGraduacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Academias, (academia) => academia.examesGraduacoes)
  academia: Academias;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.examesGraduacoes)
  modalidade: Modalidades;

  @OneToMany(
    () => AlunosExamesGraducao,
    (alunoExame) => alunoExame.examesGraduacao,
  )
  alunosExamesGraducoes: AlunosExamesGraducao[];
}
