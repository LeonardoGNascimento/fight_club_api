import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum';

@Entity()
export class Precos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column('int')
  valor: number;

  @DeleteDateColumn()
  deleted: Date;

  @Column({ nullable: true })
  titulo: string;

  @Column({ nullable: true })
  descricao: string;

  @Column({ type: 'boolean', default: false })
  modulo: boolean;

  @Column({ type: 'enum', enum: CobrancasClienteItemsTipo })
  tipo: CobrancasClienteItemsTipo;
}
