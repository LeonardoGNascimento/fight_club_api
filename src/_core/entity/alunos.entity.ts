import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { Planos } from './planos.entity';
import { Cobrancas } from './cobrancas.entity';
import { Chamada } from './chamada.entity';
import { AlunosExamesGraducao } from './alunos-exames-graducao.entity';
import { AlunosGraducao } from './alunos-graducao.entity';

export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE',
  DEVENDO = 'DEVENDO',
}

@Entity('Alunos')
export class Alunos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  cpf: string;

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

  @Column()
  academiaId: string;

  @Column()
  planosId: string;

  @Column({ type: 'enum', enum: Status, default: Status.ATIVO })
  status: Status;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.alunos)
  @JoinColumn({ name: 'academiaId' })
  academia: Academias;

  // Relacionamento com Planos
  @ManyToOne(() => Planos, (plano) => plano.alunos)
  @JoinColumn({ name: 'planosId' })
  plano: Planos;

  // Relacionamento com AlunosExamesGraducao
  @OneToMany(
    () => AlunosExamesGraducao,
    (alunoExameGraducao) => alunoExameGraducao.aluno,
  )
  alunosExamesGraducoes: AlunosExamesGraducao[];

  // Relacionamento com AlunosGraducao
  @OneToMany(() => AlunosGraducao, (alunoGraducao) => alunoGraducao.aluno)
  alunosGraducoes: AlunosGraducao[];

  // Relacionamento com Cobrancas
  @OneToMany(() => Cobrancas, (cobranca) => cobranca.aluno)
  cobrancas: Cobrancas[];

  // Relacionamento com Chamada
  @OneToMany(() => Chamada, (chamada) => chamada.aluno)
  chamada: Chamada[];
}
