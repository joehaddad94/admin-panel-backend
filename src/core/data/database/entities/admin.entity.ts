/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TemplateAdmin } from '../relations/template-admin.entity';

@Entity('panel_admins')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true, unique: true })
  reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expiry: Date;

  @Column()
  login_attempts: number;

  @Column()
  created_by_id: number;

  @Column()
  updated_by_id: number;

  @OneToMany(() => TemplateAdmin, (templateAdmin) => templateAdmin.admin)
  templateAdmin: TemplateAdmin[];
}
