import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlunosModalidades } from './alunos-modalidades.entity';
import { Modalidades } from './modalidades.entity';
import { Professores } from './professores.entity';

@Entity()
export class Turmas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.Turmas)
  modalidade: Modalidades;

  @OneToMany(
    () => AlunosModalidades,
    (alunosModalidade) => alunosModalidade.turma,
  )
  alunosModalidades: AlunosModalidades[];

  @ManyToOne(() => Professores, (professor) => professor.turmas, {
    nullable: true,
  })
  professor?: Professores;
}
