import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Clientes } from './clientes.entity';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum'; // Para o tipo de módulo

@Entity('ClienteModulos')
export class ClienteModulos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientesId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataVencimento: Date;

  @Column({ type: 'enum', enum: CobrancasClienteItemsTipo })
  modulo: CobrancasClienteItemsTipo;

  // Relacionamento com Clientes
  @ManyToOne(() => Clientes, (cliente) => cliente.clienteModulos)
  @JoinColumn({ name: 'clientesId' })
  cliente: Clientes;
}
