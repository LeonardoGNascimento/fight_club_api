import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clientes } from './clientes.entity';
import { CobrancasClienteItems } from './cobrancas-cliente-items.entity';

@Entity()
export class CobrancasCliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataPagamento: Date;

  @Column({ type: 'timestamp' })
  vencimento: Date;

  @Column({ type: 'boolean' })
  pago: boolean;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Clientes, (cliente) => cliente.cobrancasCliente)
  cliente: Clientes;

  @OneToMany(() => CobrancasClienteItems, (item) => item.cobrancasCliente)
  items: CobrancasClienteItems[];
}
