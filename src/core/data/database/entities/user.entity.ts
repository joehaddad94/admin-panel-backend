/* eslint-disable camelcase */
import { OneToMany } from 'typeorm';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationUser } from '../relations/application-user.entity';
import { InformationUser } from '../relations/information-user.entity';

@Entity('up_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reset_password_token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  confirmation_token: string;

  @Column({ type: 'boolean', nullable: true })
  confirmed: boolean;

  @Column({ type: 'boolean', nullable: true })
  blocked: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sef_id: string;

  @Column({ type: 'int', nullable: true })
  login_attempts: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @OneToMany(
    () => ApplicationUser,
    (applicationUser) => applicationUser.application,
  )
  applicationUser: ApplicationUser[];

  @OneToMany(() => InformationUser, (informationUser) => informationUser.user)
  informationUser: InformationUser[];
}
