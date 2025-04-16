import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { MicrocampApplication } from '../entities/microcamp-application.entity';
import { Microcamp } from '../entities/microcamp.entity';

@Entity('microcamp_applications_microcamp_links')
export class ApplicationMicrocamp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'microcamp_application_id', type: 'int', nullable: true })
  microcampApplicationId: number;

  @Column({ name: 'microcamp_id', type: 'int', nullable: true })
  microcampId: number;

  @OneToOne(
    () => MicrocampApplication,
    (microcampApp) => microcampApp.applicationMicrocamp,
  )
  @JoinColumn({ name: 'microcamp_application_id' })
  microcampApplication: MicrocampApplication;

  @OneToOne(() => Microcamp, (microcamp) => microcamp.applicationMicrocamp, {
    eager: true,
  })
  @JoinColumn({ name: 'microcamp_id' })
  microcamp: Microcamp;
}
