import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Academias } from './academias.entity'; // Relacionamento com Academias
import { Modalidades } from './modalidades.entity'; // Relacionamento com Modalidades
import { Professores } from './professores.entity'; // Relacionamento com Professores
import { Chamada } from './chamada.entity'; // Relacionamento com Chamada

export enum Tipo {
  AULA = 'AULA',
  EXAME = 'EXAME',
}

@Entity('Agendas')
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

  @Column()
  modalidadesId: string;

  @Column()
  academiasId: string;

  @Column({ nullable: true })
  professorId: string;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

  // Relacionamento com Academias
  @ManyToOne(() => Academias, (academia) => academia.agendas)
  @JoinColumn({ name: 'academiasId' })
  academia: Academias;

  // Relacionamento com Modalidades
  @ManyToOne(() => Modalidades, (modalidade) => modalidade.agendas)
  @JoinColumn({ name: 'modalidadesId' })
  modalidade: Modalidades;

  // Relacionamento com Professores (opcional)
  @ManyToOne(() => Professores, (professor) => professor.agenda, { nullable: true })
  @JoinColumn({ name: 'professorId' })
  professor: Professores;

  // Relacionamento com Chamada
  @OneToMany(() => Chamada, (chamada) => chamada.agenda)
  chamada: Chamada[];
}
