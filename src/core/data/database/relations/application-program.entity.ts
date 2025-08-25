import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Index,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { Program } from '../entities/program.entity';

@Entity('application_news_program_id_links')
@Index(['applicationId']) // For joining with applications
@Index(['programId']) // For filtering by program
@Index(['programId', 'applicationId']) // Composite index for common queries
export class ApplicationProgram extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_new_id', type: 'int', nullable: true })
  applicationId: number;

  @Column({ name: 'program_id', type: 'int', nullable: true })
  programId: number;

  @ManyToOne(() => Application, (application) => application.applicationProgram)
  @JoinColumn({ name: 'application_new_id' })
  application: Application;

  @ManyToOne(() => Program, (program) => program.applicationProgram, {
    eager: true,
  })
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
