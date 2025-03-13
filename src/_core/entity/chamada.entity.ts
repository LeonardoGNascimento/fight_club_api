import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alunos } from './alunos.entity';
import { Agendas } from './agendas.entity';

@Entity('Chamada')
export class Chamada {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataHora: Date;

  @Column()
  agendasId: string;

  @Column()
  alunosId: string;

  // Relacionamento com Alunos
  @ManyToOne(() => Alunos, (aluno) => aluno.chamada)
  @JoinColumn({ name: 'alunosId' })
  aluno: Alunos;

  // Relacionamento com Agendas
  @ManyToOne(() => Agendas, (agenda) => agenda.chamada)
  @JoinColumn({ name: 'agendasId' })
  agenda: Agendas;
}
