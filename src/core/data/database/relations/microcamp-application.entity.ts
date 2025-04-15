import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MicrocampApplication } from '../entities/microcamp-application.entity';

@Entity('microcamp_applications_microcamp_links')
export class ApplicationMicrocamp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'microcamp_application_id', type: 'int', nullable: true })
  microcamApplicationId: number;

  @Column({ name: 'microcamp_id', type: 'int', nullable: true })
  microcampId: number;

  @ManyToOne(
    () => MicrocampApplication,
    (microcampApplication) => microcampApplication.applicationMicrocamp,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'microcamp_application_id' })
  microcampApplication: MicrocampApplication;
}
