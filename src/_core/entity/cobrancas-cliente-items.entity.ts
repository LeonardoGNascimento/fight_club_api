import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CobrancasCliente } from './cobrancas-cliente.entity';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum'; // Enum para o tipo

@Entity('CobrancasClienteItems')
export class CobrancasClienteItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  dataHora: Date;

  @Column({ type: 'int' })
  valor: number;

  @Column()
  cobrancasClienteId: string;

  @Column({ type: 'int' })
  qtd: number;

  @Column({ type: 'enum', enum: CobrancasClienteItemsTipo, default: CobrancasClienteItemsTipo.ALUNO })
  tipo: CobrancasClienteItemsTipo;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com CobrancasCliente
  @ManyToOne(() => CobrancasCliente, (cobrancasCliente) => cobrancasCliente.items)
  @JoinColumn({ name: 'cobrancasClienteId' })
  cobrancasCliente: CobrancasCliente;
}
