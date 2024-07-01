import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cycles } from '../entities/cycle.entity';

@Entity('cycles_program_links')
export class CycleProgram extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cycle_id: number;

  @Column()
  program_id: number;

  @OneToOne(() => Cycles, (cycle) => cycle.cycleProgram)
  cycle: Cycles;
}
