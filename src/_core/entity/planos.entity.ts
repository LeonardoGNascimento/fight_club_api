import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { Alunos } from './alunos.entity';

@Entity()
export class Planos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  valor: string;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Academias, (academia) => academia.planos)
  academia: Academias;

  @OneToMany(() => Alunos, (aluno) => aluno.plano)
  alunos: Alunos[];
}
