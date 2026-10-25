import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  daytime: Date;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'text' })
  taken: string;

  @Column('uuid')
  filmId: string;
}
