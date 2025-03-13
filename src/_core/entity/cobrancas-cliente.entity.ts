import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Clientes } from './clientes.entity';
import { CobrancasClienteItems } from './cobrancas-cliente-items.entity';

@Entity('CobrancasCliente')
export class CobrancasCliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataPagamento: Date;

  @Column({ type: 'timestamp' })
  vencimento: Date;

  @Column({ type: 'boolean' })
  pago: boolean;

  @Column()
  clientesId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com a tabela Clientes
  @ManyToOne(() => Clientes, (cliente) => cliente.cobrancasCliente)
  @JoinColumn({ name: 'clientesId' })
  cliente: Clientes;

  // Relacionamento com CobrancasClienteItems
  @OneToMany(() => CobrancasClienteItems, (item) => item.cobrancasCliente)
  items: CobrancasClienteItems[];
}
