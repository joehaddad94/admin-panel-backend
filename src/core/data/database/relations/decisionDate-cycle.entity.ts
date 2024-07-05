/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cycles } from '../entities/cycle.entity';

@Entity('descision_dates_cycle_id_links')
export class DecisionDateCycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  decision_date_id: number;

  @Column({ type: 'int', nullable: true })
  cycle_id: number;

  @OneToOne(() => Cycles, (cycle) => cycle.decisionDateCycle, { eager: true })
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycles;
}
