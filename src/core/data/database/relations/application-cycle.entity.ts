import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../entities/application.entity';

@Entity('application_news_cycle_id_links')
export class ApplicationCycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'applciation_new_id', type: 'int', nullable: true })
  applicationId: number;

  @Column({ name: 'cycle_id', type: 'int', nullable: true })
  cycleId: number;

  @ManyToOne(() => Application, (application) => application.applicationCycle)
  application: Application;
}
