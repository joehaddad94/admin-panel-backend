import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TemplateAdmin } from '../relations/template-admin.entity';

@Entity('templates')
export class Templates extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  design_json: JSON;

  @Column({ type: 'text' })
  html_content: string;

  @Column({ type: 'boolean' })
  is_active: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  created_by_id: number;

  @Column()
  updated_by_id: number;

  @OneToMany(() => TemplateAdmin, (templateAdmin) => templateAdmin.template)
  templateAdmin: TemplateAdmin[];
}
