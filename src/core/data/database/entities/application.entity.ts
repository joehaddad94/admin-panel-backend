import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationInfo } from '../relations/application-info.entity';
import { ApplicationProgram } from '../relations/application-program.entity';
import { ApplicationUser } from '../relations/application-user.entity';

@Entity('application_news')
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  passed_screening: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  published_at: Date;

  @Column({ type: 'int' })
  created_by_id: number;

  @Column({ type: 'int' })
  updated_by_id: number;

  @Column({ type: 'timestamp' })
  passed_screening_date: Date;

  @Column({ type: 'boolean' })
  passed_exam: boolean;

  @Column({ type: 'timestamp' })
  passed_exam_date: Date;

  @Column({ type: 'boolean' })
  passed_interview: boolean;

  @Column({ type: 'timestamp' })
  passed_interview_date: Date;

  @Column({ type: 'boolean' })
  enrolled: boolean;

  @Column({ type: 'text' })
  remarks: string;

  @Column({ type: 'jsonb' })
  extras: any;

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
}
