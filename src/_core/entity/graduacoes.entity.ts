import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlunosGraducaoHistorico } from './alunos-graducao-historico.entity'; // Relacionamento com Modalidades
import { Modalidades } from './modalidades.entity';
import { AlunosModalidades } from './alunos-modalidades.entity';

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

  @OneToMany(() => AlunosGraducaoHistorico, (alunosGraducao) => alunosGraducao.graduacao)
  alunosGraducoes: AlunosGraducaoHistorico[];

  @OneToMany(() => AlunosModalidades, (alunosGraducao) => alunosGraducao.graduacao)
  alunosModalidades: AlunosModalidades[];
}
