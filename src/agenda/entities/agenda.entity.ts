import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AgendasEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['AULA', 'EXAME'],
  })
  tipo: string;

  @Column({ type: 'datetime' })
  dataHora: Date;

  @Column({ type: 'datetime' })
  dataInicio: Date;

  @Column({ type: 'datetime' })
  dataFinal: Date;

  @Column({ type: 'varchar' })
  modalidadesId: string;

  @Column({ type: 'varchar' })
  academiasId: string;

  @Column({ type: 'varchar', nullable: true })
  professorId: string;

  @Column({ type: 'datetime', nullable: true })
  deleted: Date | null;
}
