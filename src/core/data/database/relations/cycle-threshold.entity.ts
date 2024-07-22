import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cycles } from '../entities/cycle.entity';
import { Threshold } from '../entities/threshold.entity';

@Entity('thresholds_cycle_id_links')
export class ThresholdCycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  cycle_id: number;

  @Column({ type: 'int', nullable: true })
  threshold_id: number;

  @OneToOne(() => Cycles, (cycle) => cycle.thresholdCycle, {
    eager: false,
  })
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycles;

  @OneToOne(() => Threshold, (threshold) => threshold.thresholdCycle, {
    eager: true,
  })
  @JoinColumn({ name: 'threshold_id' })
  threshold: Threshold;
}
