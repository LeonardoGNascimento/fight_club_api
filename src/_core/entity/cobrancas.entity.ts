import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Academias } from './academias.entity';
import { Alunos } from './alunos.entity';
import { TiposCobrancas } from './tipos-cobrancas.enum';

@Entity('Cobrancas')
export class Cobrancas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataPagamento: Date;

  @Column({ type: 'timestamp' })
  vencimento: Date;

  @Column({ type: 'boolean', default: false })
  pago: boolean;

  @Column()
  alunosId: string;

  @Column()
  academiasId: string;

  @Column('int')
  valor: number;

  @Column({ type: 'enum', enum: TiposCobrancas })
  tipo: TiposCobrancas;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.cobrancas)
  @JoinColumn({ name: 'academiasId' })
  academia: Academias;

  // Relacionamento com Alunos
  @ManyToOne(() => Alunos, (aluno) => aluno.cobrancas)
  @JoinColumn({ name: 'alunosId' })
  aluno: Alunos;
}
