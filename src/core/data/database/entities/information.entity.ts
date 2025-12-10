/* eslint-disable camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ApplicationInfo } from '../relations/application-info.entity';
import { InformationUser } from '../relations/information-user.entity';

@Entity('information')
export class Information extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country_origin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country_residence: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  residency_status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  marital_status: string;

  @Column({ type: 'int', nullable: true })
  people_in_household: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  householder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type_of_disability: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type_of_physical_disability: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  employment_situation: string;

  @Column({ type: 'bigint', nullable: true })
  personal_income: number;

  @Column({ type: 'bigint', nullable: true })
  household_income: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  casa: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference_source: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  which_social: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  org_referral: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  person_referral: string;

  @Column({ type: 'text', nullable: true })
  known_languages: string;

  @Column({ type: 'boolean', nullable: true })
  terms_conditions: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mother_maiden_first: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mother_maiden_last: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  degree_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field_of_study: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  major_title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sef_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  children: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  disability: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  family_disability: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  work_experience_in_se: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  do_you_know_any: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  number_of_children: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  other_institution: string;

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  governate: string;

  @OneToMany(() => ApplicationInfo, (applicationInfo) => applicationInfo.info)
  applicationInfo: ApplicationInfo[];

  @OneToMany(
    () => InformationUser,
    (informationUser) => informationUser.information,
  )
  informationUser: InformationUser[];
}
