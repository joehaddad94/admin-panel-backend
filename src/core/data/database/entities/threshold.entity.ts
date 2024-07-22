import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ThresholdCycle } from '../relations/cycle-threshold.entity';

@Entity('thresholds')
export class Threshold extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  exam_passing_grade: number;

  @Column({ type: 'int', nullable: true })
  weight_tech: number;

  @Column({ type: 'int', nullable: true })
  weight_soft: number;

  @Column({ type: 'int', nullable: true })
  primary_passing_grade: number;

  @Column({ type: 'int', nullable: true })
  secondary_passing_grade: number;

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

  @OneToOne(() => ThresholdCycle, (thresholdCycle) => thresholdCycle.cycle)
  thresholdCycle: ThresholdCycle;
}
