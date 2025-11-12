import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { Templates } from '../entities/template.entity';

@Entity('templates_panel_admin_links')
export class TemplateAdmin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  template_id: number;

  @Column({ type: 'int', nullable: true })
  panel_admin_id: number;

  @ManyToOne(() => Templates, (template) => template.templateAdmin)
  @JoinColumn({ name: 'template_id' })
  template: Templates;

  @ManyToOne(() => Admin, (admin) => admin.templateAdmin)
  @JoinColumn({ name: 'panel_admin_id' })
  admin: Admin;
}
