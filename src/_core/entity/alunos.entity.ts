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
import { AlunosExamesGraducao } from './alunos-exames-graducao.entity';
import { AlunosGraducao } from './alunos-graducao.entity';
import { Chamada } from './chamada.entity';
import { Cobrancas } from './cobrancas.entity';
import { Planos } from './planos.entity';

export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE',
  DEVENDO = 'DEVENDO',
}

@Entity()
export class Alunos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  dataNascimento: string;

  @Column()
  rua: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  cep: string;

  @Column()
  numero: string;

  @Column()
  telefone: string;

  @Column({ type: 'enum', enum: Status, default: Status.ATIVO })
  status: Status;

  @DeleteDateColumn()
  deleted: Date;

  @Column()
  academiaId: string;

  @Column()
  planoId: string;

  @ManyToOne(() => Academias, (academia) => academia.alunos)
  academia: Academias;

  @ManyToOne(() => Planos, (plano) => plano.alunos)
  plano: Planos;

  @OneToMany(
    () => AlunosExamesGraducao,
    (alunoExameGraducao) => alunoExameGraducao.aluno,
  )
  alunosExamesGraducoes: AlunosExamesGraducao[];

  @OneToMany(() => AlunosGraducao, (alunoGraducao) => alunoGraducao.aluno)
  alunosGraduacoes: AlunosGraducao[];

  @OneToMany(() => Cobrancas, (cobranca) => cobranca.aluno)
  cobrancas: Cobrancas[];

  @OneToMany(() => Chamada, (chamada) => chamada.aluno)
  chamada: Chamada[];
}
