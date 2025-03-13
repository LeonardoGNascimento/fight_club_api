import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum';

@Entity('Precos')
export class Precos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column('int')
  valor: number;

  @Column({ type: 'timestamp', nullable: true })
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
