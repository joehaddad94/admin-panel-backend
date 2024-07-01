import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CycleProgram } from '../relations/cycle-program.entity';

@Entity('cycles')
export class Cycles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamp' })
  from_date: Date;

  @Column({ type: 'timestamp' })
  to_date: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @OneToOne(() => CycleProgram, (cycleProgram) => cycleProgram.cycle)
  @JoinColumn({ name: 'cycle_program_id' })
  cycleProgram: CycleProgram;
}
