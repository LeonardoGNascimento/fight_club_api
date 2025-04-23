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
import { Agendas } from './agendas.entity';
import { Turmas } from './turmas.entity';

export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE',
  DEVENDO = 'DEVENDO',
}

@Entity()
export class Professores {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  rg: string;

  @Column()
  endereco: string;

  @Column()
  numero: string;

  @Column({ nullable: true })
  complemento: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @Column()
  estado: string;

  @Column()
  cidade: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefone: string;

  @Column({ nullable: true })
  telefoneResidencial: string;

  @Column()
  nascimento: Date;

  @Column({ type: 'enum', enum: Status, default: Status.ATIVO })
  status: Status;

  @DeleteDateColumn()
  deleted: Date;

  @OneToMany(() => Agendas, (agenda) => agenda.professor)
  agenda: Agendas[];

  @ManyToOne(() => Academias, (academia) => academia.professores)
  academia: Academias;

  @OneToMany(() => Turmas, (turma) => turma.professor)
  turmas: Turmas[];
}
