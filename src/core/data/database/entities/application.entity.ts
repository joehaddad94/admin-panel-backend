/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationInfo } from '../relations/application-info.entity';
import { ApplicationProgram } from '../relations/application-program.entity';
import { ApplicationUser } from '../relations/application-user.entity';
import { ApplicationCycle } from '../relations/application-cycle.entity';
import { Status } from '../../types/applications/applications.types';
import { ApplicationSection } from '../relations/applications-sections.entity';

@Entity('application_news')
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: true })
  passed_screening: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @Column({ type: 'date', nullable: true })
  passed_screening_date: Date;

  @Column({ type: 'boolean', nullable: true })
  passed_exam: boolean;

  @Column({ type: 'date', nullable: true })
  passed_exam_date: Date;

  @Column({ type: 'boolean', nullable: true })
  passed_interview: boolean;

  @Column({ type: 'date', nullable: true })
  passed_interview_date: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'jsonb', nullable: true })
  extras: any;

  @Column({ type: 'boolean', nullable: true })
  is_eligible: boolean;

  @Column({ type: 'bigint', nullable: true })
  exam_score: number;

  @Column({ type: 'bigint', nullable: true })
  tech_interview_score: number;

  @Column({ type: 'bigint', nullable: true })
  soft_interview_score: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: Status.PENDING,
  })
  status: string;

  @Column({ type: 'boolean', nullable: true })
  screening_email_sent: boolean;

  @Column({ type: 'boolean', nullable: true })
  passed_exam_email_sent: boolean;

  @Column({ type: 'boolean', nullable: true })
  status_email_sent: boolean;

  @OneToMany(
    () => ApplicationInfo,
    (applicationInfo) => applicationInfo.application,
  )
  applicationInfo: ApplicationInfo[];

  @OneToMany(
    () => ApplicationProgram,
    (applicationProgram) => applicationProgram.application,
  )
  applicationProgram: ApplicationProgram[];

  @OneToMany(
    () => ApplicationUser,
    (applicationUser) => applicationUser.application,
    { eager: true },
  )
  applicationUser: ApplicationUser[];

  @OneToMany(
    () => ApplicationCycle,
    (applicationCycle) => applicationCycle.application,
    { nullable: true },
  )
  applicationCycle: ApplicationCycle[];

  @OneToOne(
    () => ApplicationSection,
    (applicationSection) => applicationSection.application,
    { nullable: true },
  )
  applicationSection: ApplicationSection;
}
