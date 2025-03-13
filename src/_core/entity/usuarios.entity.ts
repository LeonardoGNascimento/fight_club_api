import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Clientes } from './clientes.entity';

@Entity('Usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  clienteId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com a tabela Clientes
  @ManyToOne(() => Clientes, (cliente) => cliente.usuarios)
  @JoinColumn({ name: 'clienteId' })
  cliente: Clientes;
}
