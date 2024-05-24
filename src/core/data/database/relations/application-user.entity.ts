import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';

@Entity('application_news_user_id_links')
export class ApplicationUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  application_new_id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => Application, (application) => application.applicationUser)
  @JoinColumn({ name: 'application_new_id' })
  application: Application;

  @ManyToOne(() => User, (user) => user.applicationUser, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
