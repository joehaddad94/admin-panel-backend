/* eslint-disable camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { ApplicationProgram } from '../relations/application-program.entity';
import { CycleProgram } from '../relations/cycle-program.entity';

@Entity('programs')
@Index(['id'])
@Index(['program_name'])
@Index(['abbreviation'])
export class Program extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  program_name: string;

  @Column({ type: 'varchar', nullable: true })
  abbreviation: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  curriculum_url: string;

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

  @OneToMany(
    () => ApplicationProgram,
    (applicationProgram) => applicationProgram.program,
    { eager: false }
  )
  applicationProgram: ApplicationProgram[];

  @OneToOne(() => CycleProgram, (cycleProgram) => cycleProgram.program)
  cycleProgram: CycleProgram;
}
