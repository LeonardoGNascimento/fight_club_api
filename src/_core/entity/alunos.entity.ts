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
import { ExamesGraducaoAlunos } from './exames-graducao-alunos.entity';
import { AlunosGraducaoHistorico } from './alunos-graducao-historico.entity';
import { Chamada } from './chamada.entity';
import { Cobrancas } from './cobrancas.entity';
import { Planos } from './planos.entity';
import { AlunosModalidades } from './alunos-modalidades.entity';

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

  @ManyToOne(() => Academias, (academia) => academia.alunos)
  academia: Academias;

  @ManyToOne(() => Planos, (plano) => plano.alunos)
  plano: Planos;

  @OneToMany(
    () => ExamesGraducaoAlunos,
    (alunoExameGraducao) => alunoExameGraducao.aluno,
  )
  alunosExamesGraducoes: ExamesGraducaoAlunos[];

  @OneToMany(() => AlunosGraducaoHistorico, (alunoGraducao) => alunoGraducao.aluno)
  alunosGraducaoHistorico: AlunosGraducaoHistorico[];

  @OneToMany(() => AlunosModalidades, (alunosModalidades) => alunosModalidades.aluno)
  alunosModalidades: AlunosModalidades[];

  @OneToMany(() => Cobrancas, (cobranca) => cobranca.aluno)
  cobrancas: Cobrancas[];

  @OneToMany(() => Chamada, (chamada) => chamada.aluno)
  chamada: Chamada[];
}
