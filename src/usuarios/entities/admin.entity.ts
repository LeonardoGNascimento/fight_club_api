import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UsuariosEntity } from './usuario.entity';

@Entity('Admin')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  usuarioId: string;

  @OneToOne(() => UsuariosEntity)
  @JoinColumn({ name: 'usuarioId' })
  usuario: UsuariosEntity;
}
