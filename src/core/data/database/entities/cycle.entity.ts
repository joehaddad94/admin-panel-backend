/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { CycleProgram } from '../relations/cycle-program.entity';
import { DecisionDateCycle } from '../relations/decisionDate-cycle.entity';
import { ApplicationCycle } from '../relations/application-cycle.entity';
import { ThresholdCycle } from '../relations/cycle-threshold.entity';
import { SectionCycle } from '../relations/section-cycle.entity';

@Entity('cycles')
@Index(['id'])
@Index(['name'])
@Index(['code'])
export class Cycles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  from_date: Date;

  @Column({ type: 'date' })
  to_date: Date;

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

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  code: string;

  @OneToOne(() => CycleProgram, (cycleProgram) => cycleProgram.cycle)
  cycleProgram: CycleProgram;

  @OneToOne(() => ApplicationCycle, (applicationCycle) => applicationCycle)
  applicationCycle: ApplicationCycle;

  @OneToOne(() => DecisionDateCycle, (decisionDate) => decisionDate.cycle)
  decisionDateCycle: DecisionDateCycle;

  @OneToOne(() => ThresholdCycle, (thresholdCycle) => thresholdCycle.cycle)
  thresholdCycle: ThresholdCycle;

  @OneToOne(() => SectionCycle, (sectionCycle) => sectionCycle.cycle)
  sectionCycle: SectionCycle;
}
