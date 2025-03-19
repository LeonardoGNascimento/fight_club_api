import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlunosGraducao } from './alunos-graducao.entity'; // Relacionamento com Modalidades
import { Modalidades } from './modalidades.entity';

@Entity()
export class Graduacoes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  nome: string;

  @Column({ type: 'int', nullable: true })
  qtdGraus: number;

  @Column({ type: 'int', default: 0 })
  ordem: number;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.graduacoes)
  modalidade: Modalidades;

  @OneToMany(() => AlunosGraducao, (alunosGraducao) => alunosGraducao.graduacao)
  alunosGraducoes: AlunosGraducao[];
}
