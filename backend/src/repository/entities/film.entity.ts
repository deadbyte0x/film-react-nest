
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'varchar', length: 255 })
  director: string;

  @Column('text', {
    array: true,
    default: () => "'{}'::text[]",
  })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  cover: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
