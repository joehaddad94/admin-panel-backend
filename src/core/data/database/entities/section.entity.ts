/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SectionCycle } from '../relations/section-cycle.entity';
import { ApplicationSection } from '../relations/applications-sections.entity';

@Entity('sections')
export class Sections extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  name: string;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true,
  })
  updated_at: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  published_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by_id: number;

  @Column({ type: 'int', nullable: true })
  updated_by_id: number;

  @OneToOne(() => SectionCycle, (sectionCycle) => sectionCycle.section)
  sectionCycle: SectionCycle;

  @OneToOne(
    () => ApplicationSection,
    (applicationSection) => applicationSection.section,
  )
  applicationSection: ApplicationSection;
}
