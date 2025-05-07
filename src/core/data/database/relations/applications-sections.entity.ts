import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { Sections } from '../entities/section.entity';

@Entity('application_news_section_id_links')
export class ApplicationSection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  application_new_id: number;

  @Column({ type: 'int', nullable: true })
  section_id: number;

  @OneToOne(
    () => Application,
    (application) => application.applicationSection,

  )
  @JoinColumn({ name: 'application_new_id' })
  application: Application;

  @OneToOne(() => Sections, (section) => section.applicationSection, {
    eager: true,
  })
  @JoinColumn({ name: 'section_id' })
  section: Sections;
}
