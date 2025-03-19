import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academias } from './academias.entity';
import { Chamada } from './chamada.entity';
import { Modalidades } from './modalidades.entity';
import { Professores } from './professores.entity';

export enum Tipo {
  AULA = 'AULA',
  EXAME = 'EXAME',
}

@Entity()
export class Agendas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Tipo,
  })
  tipo: Tipo;

  @CreateDateColumn()
  dataHora: Date;

  @Column()
  dataInicio: Date;

  @Column()
  dataFinal: Date;

  @DeleteDateColumn()
  deleted: Date;

  @ManyToOne(() => Academias, (academia) => academia.agendas)
  academia: Academias;

  @ManyToOne(() => Modalidades, (modalidade) => modalidade.agendas)
  modalidade: Modalidades;

  @ManyToOne(() => Professores, (professor) => professor.agenda, {
    nullable: true,
  })
  professor: Professores;

  @OneToMany(() => Chamada, (chamada) => chamada.agenda)
  chamada: Chamada[];
}
