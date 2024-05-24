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

  @Column()
  info_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Information, (information) => information.informationUser)
  @JoinColumn({ name: 'info_id' })
  information: Information;

  @ManyToOne(() => User, (user) => user.informationUser, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
