import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Templates } from '../entities/template.entity';
import { Program } from '../entities/program.entity';

@Entity('templates_program_links')
export class TemplateProgram extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  template_id: number;

  @Column({ type: 'int', nullable: true })
  program_id: number;

  @ManyToOne(() => Templates, (template) => template.templateProgram)
  @JoinColumn({ name: 'template_id' })
  template: Templates;

  @ManyToOne(() => Program, (program) => program.templateProgram)
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
