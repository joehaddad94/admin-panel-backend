/* eslint-disable camelcase */
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Information } from '../entities/information.entity';
import { User } from '../entities/user.entity';

@Entity('information_user_id_links')
export class InformationUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  info_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => Information, (information) => information.informationUser)
  @JoinColumn({ name: 'info_id' })
  information: Information;

  @ManyToOne(() => User, (user) => user.informationUser, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
