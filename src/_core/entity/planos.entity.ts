import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Academias } from './academias.entity';
import { Alunos } from './alunos.entity';

@Entity('Planos')
export class Planos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  valor: string;

  @Column()
  academiaId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.planos)
  @JoinColumn({ name: 'academiaId' })
  academia: Academias;

  // Relacionamento com Alunos
  @OneToMany(() => Alunos, (aluno) => aluno.plano)
  alunos: Alunos[];
}
