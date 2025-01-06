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

  @Column({ type: 'varchar', length: 255, nullable: true })
  interview_meet_link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  info_session_recorded_link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  exam_link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status_confirmation_form: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  orientation_date: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  class_debut_date: Date;

  @OneToOne(
    () => DecisionDateCycle,
    (decisionDateCycle) => decisionDateCycle.cycle,
  )
  decisionDateCycle: DecisionDateCycle;
}
