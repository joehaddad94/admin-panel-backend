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

@Entity('cycles_program_links')
export class CycleProgram extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  cycle_id: number;

  @Column({ type: 'int', nullable: true })
  program_id: number;

  @OneToOne(() => Cycles, (cycle) => cycle.cycleProgram)
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycles;
}
