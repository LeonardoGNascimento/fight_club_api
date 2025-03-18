import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Clientes } from './clientes.entity';
import { Alunos } from './alunos.entity';
import { Planos } from './planos.entity';
import { Modalidades } from './modalidades.entity';
import { Agendas } from './agendas.entity';
import { ExamesGraduacao } from './exames-graduacao.entity';
import { Cobrancas } from './cobrancas.entity';
import { Professores } from './professores.entity';

@Entity('Academias')
export class Academias {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  clienteId: string;

  @Column({ type: 'datetime', nullable: true })
  deleted: Date;

  // Relacionamento com Clientes
  @ManyToOne(() => Clientes, (cliente) => cliente.academias)
  @JoinColumn({ name: 'clienteId' })
  cliente: Clientes;

  // Relacionamentos OneToMany
  @OneToMany(() => Alunos, (aluno) => aluno.academia)
  alunos: Alunos[];

  @OneToMany(() => Planos, (plano) => plano.academia)
  planos: Planos[];

  @OneToMany(() => Modalidades, (modalidade) => modalidade.academia)
  modalidades: Modalidades[];

  @OneToMany(() => Agendas, (agenda) => agenda.academia)
  agendas: Agendas[];

  @OneToMany(() => ExamesGraduacao, (exameGraduacao) => exameGraduacao.academia)
  examesGraduacoes: ExamesGraduacao[];

  @OneToMany(() => Cobrancas, (cobranca) => cobranca.academia)
  cobrancas: Cobrancas[];

  @OneToMany(() => Professores, (professor) => professor.academia)
  professores: Professores[];
}
