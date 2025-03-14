import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('Usuarios')
export class UsuariosEntity {
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

  @CreateDateColumn({
    default: Date.now,
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: Date.now,
  })
  updatedAt: Date;

  @Column({ nullable: true })
  deleted: Date;
}
