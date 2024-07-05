/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecisionDateCycle } from '../relations/decisionDate-cycle.entity';

@Entity('decision-dates')
export class DecisionDates extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  exam_date: Date;

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

  @OneToOne(
    () => DecisionDateCycle,
    (decisionDateCycle) => decisionDateCycle.cycle,
  )
  decisionDateCycle: DecisionDateCycle;
}
