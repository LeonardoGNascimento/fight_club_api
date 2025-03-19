import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agendas } from './agendas.entity';
import { Alunos } from './alunos.entity';

@Entity()
export class Chamada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @ManyToOne(() => Alunos, (aluno) => aluno.chamada)
  aluno: Alunos;

  @ManyToOne(() => Agendas, (agenda) => agenda.chamada)
  agenda: Agendas;
}
