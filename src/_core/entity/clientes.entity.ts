import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuarios } from './usuarios.entity';
import { Academias } from './academias.entity';
import { CobrancasCliente } from './cobrancas-cliente.entity';
import { ClienteModulos } from './cliente-modulos.entity';

@Entity('Clientes')
export class Clientes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  cnpj: string;

  @Column({ default: 0 })
  desconto: number;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamentos

  // Relacionamento com a tabela Usuarios
  @OneToMany(() => Usuarios, (usuario) => usuario.cliente)
  usuarios: Usuarios[];

  // Relacionamento com a tabela Academias
  @OneToMany(() => Academias, (academia) => academia.cliente)
  academias: Academias[];

  // Relacionamento com a tabela CobrancasCliente
  @OneToMany(() => CobrancasCliente, (cobrancaCliente) => cobrancaCliente.cliente)
  cobrancasCliente: CobrancasCliente[];

  // Relacionamento com a tabela ClienteModulos
  @OneToMany(() => ClienteModulos, (clienteModulo) => clienteModulo.cliente)
  clienteModulos: ClienteModulos[];
}
