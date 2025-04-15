import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApplicationMicrocamp } from '../relations/microcamp-application.entity';

@Entity('microcamp_applications')
export class MicrocampApplication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  full_name: string;

  @Column({ type: 'bigint', nullable: true })
  phone_number: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  country_residence: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  age_range: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  referral_source: string;

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

  @Column({ type: 'timestamp without time zone', nullable: true })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @OneToOne(
    () => ApplicationMicrocamp,
    (appMicrocamp) => appMicrocamp.microcampApplication,
  )
  applicationMicrocamp: ApplicationMicrocamp;
}
