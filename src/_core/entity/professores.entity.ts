import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Agendas } from './agendas.entity';
import { Academias } from './academias.entity';

export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE',
  DEVENDO = 'DEVENDO'
}

@Entity('Professores')
export class Professores {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
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

  @Column()
  academiaId: string;

  @Column({ type: 'enum', enum: Status, default: Status.ATIVO })
  status: Status;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Agendas
  @OneToMany(() => Agendas, (agenda) => agenda.professor)
  agenda: Agendas[];

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.professores)
  @JoinColumn({ name: 'academiaId' })
  academia: Academias;
}
