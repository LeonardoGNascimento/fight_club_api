import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { CobrancasCliente } from './cobrancas-cliente.entity';
import { ClienteModulos } from './cliente-modulos.entity';
import { Usuarios } from './usuarios.entity';

@Entity()
export class Clientes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  cnpj: string;

  @Column({ default: 0 })
  desconto: number;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  @OneToMany(() => Usuarios, (usuario) => usuario.cliente)
  usuarios: Usuarios[];

  @OneToMany(() => Academias, (academia) => academia.cliente)
  academias: Academias[];

  @OneToMany(
    () => CobrancasCliente,
    (cobrancaCliente) => cobrancaCliente.cliente,
  )
  cobrancasCliente: CobrancasCliente[];

  @OneToMany(() => ClienteModulos, (clienteModulo) => clienteModulo.cliente)
  clienteModulos: ClienteModulos[];
}
