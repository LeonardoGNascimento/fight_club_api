import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Clientes } from './clientes.entity';
import { Admin } from './admin.entity';
import { Academias } from './academias.entity';

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
  academiaId: string;

  @Column()
  clienteId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deleted: Date;

  @ManyToOne(() => Clientes, (cliente) => cliente.usuarios)
  cliente: Clientes;

  @ManyToOne(() => Academias, (academia) => academia.usuarios)
  academia: Academias;

  @OneToOne(() => Admin, (admin) => admin.usuario)
  admin: Admin;
}
