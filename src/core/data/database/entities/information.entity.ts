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

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  middle_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  mobile: string;

  @Column({ type: 'varchar' })
  country_origin: string;

  @Column({ type: 'varchar' })
  country_residence: string;

  @Column({ type: 'varchar' })
  residency_status: string;

  @Column({ type: 'varchar' })
  marital_status: string;

  @Column({ type: 'int' })
  people_in_household: number;

  @Column({ type: 'varchar' })
  householder: string;

  @Column({ type: 'varchar', nullable: true })
  type_of_disability: string;

  @Column({ type: 'varchar', nullable: true })
  type_of_physical_disability: string;

  @Column({ type: 'varchar' })
  employment_situation: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  personal_income: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  household_income: number;

  @Column({ type: 'varchar' })
  district: string;

  @Column({ type: 'varchar' })
  casa: string;

  @Column({ type: 'varchar' })
  reference_source: string;

  @Column({ type: 'varchar', nullable: true })
  which_social: string;

  @Column({ type: 'varchar', nullable: true })
  org_referral: string;

  @Column({ type: 'varchar', nullable: true })
  person_referral: string;

  @Column({ type: 'varchar' })
  known_languages: string;

  @Column({ type: 'boolean' })
  terms_conditions: boolean;

  @Column({ type: 'varchar' })
  mother_maiden_first: string;

  @Column({ type: 'varchar' })
  mother_maiden_last: string;

  @Column({ type: 'varchar' })
  degree_type: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  institution: string;

  @Column({ type: 'varchar' })
  field_of_study: string;

  @Column({ type: 'varchar' })
  major_title: string;

  @Column({ type: 'varchar' })
  sef_id: string;

  @Column({ type: 'varchar' })
  children: string;

  @Column({ type: 'varchar' })
  disability: string;

  @Column({ type: 'varchar' })
  family_disability: string;

  @Column({ type: 'varchar' })
  work_experience_in_se: string;

  @Column({ type: 'varchar' })
  do_you_know_any: string;

  @Column({ type: 'int', nullable: true })
  number_of_children: number;

  @Column({ type: 'varchar', nullable: true })
  other_institution: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp' })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @Column({ type: 'varchar', nullable: true })
  governate: string;

  @OneToMany(() => ApplicationInfo, (applicationInfo) => applicationInfo.info)
  applicationInfo: ApplicationInfo[];

  @OneToMany(
    () => InformationUser,
    (informationUser) => informationUser.information,
  )
  informationUser: InformationUser[];
}
