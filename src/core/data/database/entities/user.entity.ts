/* eslint-disable camelcase */
import { OneToMany } from 'typeorm';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationUser } from '../relations/application-user.entity';
import { InformationUser } from '../relations/information-user.entity';

@Entity('up_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  reset_password_token: string;

  @Column({ type: 'varchar', nullable: true })
  confirmation_token: string;

  @Column({ type: 'boolean' })
  confirmed: boolean;

  @Column({ type: 'boolean' })
  blocked: boolean;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar' })
  sef_id: string;

  @Column({ type: 'int' })
  login_attempts: number;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
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
