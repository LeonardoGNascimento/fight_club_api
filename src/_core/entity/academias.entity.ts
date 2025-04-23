import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agendas } from './agendas.entity';
import { Alunos } from './alunos.entity';
import { Clientes } from './clientes.entity';
import { Cobrancas } from './cobrancas.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';
import { Modalidades } from './modalidades.entity';
import { Planos } from './planos.entity';
import { Professores } from './professores.entity';
import { Usuarios } from './usuarios.entity';

@Entity()
export class Academias {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

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

  @DeleteDateColumn()
  deleted?: Date;

  @ManyToOne(() => Clientes, (cliente) => cliente.academias)
  cliente: Clientes;

  @OneToMany(() => Alunos, (aluno) => aluno.academia)
  alunos: Alunos[];

  @OneToMany(() => Planos, (plano) => plano.academia)
  planos: Planos[];

  @OneToMany(() => Modalidades, (modalidade) => modalidade.academia)
  modalidades: Modalidades[];

  @OneToMany(() => Agendas, (agenda) => agenda.academia)
  agendas: Agendas[];

  @OneToMany(() => Cobrancas, (cobranca) => cobranca.academia)
  cobrancas: Cobrancas[];

  @OneToMany(() => Professores, (professor) => professor.academia)
  professores: Professores[];
}
