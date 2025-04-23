import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Clientes } from './clientes.entity';

@Entity()
export class Usuarios {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  sobrenome: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  emailVerified: boolean;

  @Column()
  clienteId: string;

  @Column({ default: false })
  admin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deleted: Date;

  @ManyToOne(() => Clientes, (cliente) => cliente.usuarios)
  cliente: Clientes;
}
