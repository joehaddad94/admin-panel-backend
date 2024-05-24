import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { Information } from '../entities/information.entity';
import { ApplicationProgram } from '../relations/application-program.entity';

@Entity('application_news_information_id_links')
export class ApplicationInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  application_new_id: number;

  @Column({ type: 'int' })
  info_id: number;

  @Column({ type: 'int' })
  application_new_order: number;

  @ManyToOne(() => Application, (application) => application.applicationInfo, {
    eager: true,
  })
  @JoinColumn({ name: 'application_new_id' })
  application: Application;

  @ManyToOne(() => Information, (info) => info.applicationInfo, {
    eager: true,
  })
  @JoinColumn({ name: 'info_id' })
  info: Information;

  @OneToMany(
    () => ApplicationProgram,
    (applicationProgram) => applicationProgram.application,
  )
  applicationProgram: ApplicationProgram[];
}
