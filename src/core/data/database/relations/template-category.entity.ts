import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Templates } from "../entities/template.entity";
import { TemplateCategory } from "../entities/template-category.entity";

@Entity('templates_template_category_links')
export class TemplateCategoryLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  template_id: number;

  @Column({ type: 'int', nullable: true })
  template_category_id: number;

  @ManyToOne(() => Templates)
  @JoinColumn({ name: 'template_id' })
  template: Templates;

  @ManyToOne(() => TemplateCategory)
  @JoinColumn({ name: 'template_category_id' })
  templateCategory: TemplateCategory;
}
