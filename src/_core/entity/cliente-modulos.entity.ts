import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clientes } from './clientes.entity';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum'; // Para o tipo de módulo

@Entity()
export class ClienteModulos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataVencimento: Date;

  @Column({ type: 'enum', enum: CobrancasClienteItemsTipo })
  modulo: CobrancasClienteItemsTipo;

  @ManyToOne(() => Clientes, (cliente) => cliente.clienteModulos)
  cliente: Clientes;
}
