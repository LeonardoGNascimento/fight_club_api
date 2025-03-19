import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { Alunos } from './alunos.entity';
import { TiposCobrancas } from './tipos-cobrancas.enum';

@Entity()
export class Cobrancas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataPagamento: Date;

  @Column({ type: 'timestamp' })
  vencimento: Date;

  @Column({ type: 'boolean', default: false })
  pago: boolean;

  @Column('int')
  valor: number;

  @Column({ type: 'enum', enum: TiposCobrancas })
  tipo: TiposCobrancas;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Academias, (academia) => academia.cobrancas)
  academia: Academias;

  @ManyToOne(() => Alunos, (aluno) => aluno.cobrancas)
  aluno: Alunos;
}
