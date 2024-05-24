import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { Application } from '../entities/application.entity';
import { Program } from '../entities/program.entity';
import { Information } from '../entities/information.entity';

@Entity('application_news_program_id_links')
export class ApplicationProgram extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_new_id', type: 'int' })
  applicationId: number;

  @Column({ name: 'program_id', type: 'int' })
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
