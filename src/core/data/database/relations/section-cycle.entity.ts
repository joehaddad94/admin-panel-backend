/* eslint-disable camelcase */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cycles } from '../entities/cycle.entity';
import { Sections } from '../entities/section.entity';

@Entity('sections_cycle_id_links')
export class SectionCycle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  cycle_id: number;

  @Column({ type: 'int', nullable: true })
  section_id: number;

  @OneToOne(() => Cycles, (cycle) => cycle.sectionCycle, { eager: true })
  @JoinColumn({ name: 'cycle_id' })
  cycle: Cycles;

  @OneToOne(() => Sections, (section) => section.sectionCycle, { eager: false })
  @JoinColumn({ name: 'section_id' })
  section: Sections;
}
