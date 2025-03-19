import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CobrancasClienteItemsTipo } from './cobrancas-cliente-items-tipo.enum'; // Enum para o tipo
import { CobrancasCliente } from './cobrancas-cliente.entity';

@Entity()
export class CobrancasClienteItems {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'int' })
  valor: number;

  @Column({ type: 'int' })
  qtd: number;

  @Column({
    type: 'enum',
    enum: CobrancasClienteItemsTipo,
    default: CobrancasClienteItemsTipo.ALUNO,
  })
  tipo: CobrancasClienteItemsTipo;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(
    () => CobrancasCliente,
    (cobrancasCliente) => cobrancasCliente.items,
  )
  cobrancasCliente: CobrancasCliente;
}
