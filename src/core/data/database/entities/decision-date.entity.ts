/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecisionDateCycle } from '../relations/decisionDate-cycle.entity';

@Entity('decision_dates')
export class DecisionDates extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  date_time_1: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  updated_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_4: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link_3: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  date_1: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  date_2: Date;

  @OneToOne(
    () => DecisionDateCycle,
    (decisionDateCycle) => decisionDateCycle.cycle,
  )
  decisionDateCycle: DecisionDateCycle;
}
