import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { Cycles } from '../entities/cycle.entity';

@Entity('application_news_cycle_id_links')
@Index(['applicationId']) // For joining with applications
@Index(['cycleId']) // For filtering by cycle
@Index(['cycleId', 'applicationId']) // Composite index for common queries
export class ApplicationCycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_new_id', type: 'int', nullable: true })
  applicationId: number;

  @Column({ name: 'cycle_id', type: 'int', nullable: true })
  cycleId: number;

  @ManyToOne(() => Application, (application) => application.applicationCycle, {
    eager: true,
  })
  @JoinColumn({ name: 'application_new_id' })
  application: Application;

  @ManyToOne(() => Cycles, (cycle) => cycle.applicationCycle, { eager: true })
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycles;
}
