import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuarios } from './usuarios.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Usuarios, (usuario) => usuario.admin)
  @JoinColumn()
  usuario: Usuarios;
}
