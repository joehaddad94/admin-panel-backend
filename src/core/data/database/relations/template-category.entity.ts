import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne, Unique } from "typeorm";
import { Templates } from "../entities/template.entity";
import { TemplateCategory } from "../entities/template-category.entity";


@Entity('templates_template_category_links')
@Unique(['template_id'])
@Unique(['template_category_id'])
export class TemplateCategoryLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  template_id: number;

  @Column({ type: 'int', nullable: true })
  template_category_id: number;

  @OneToOne(() => Templates, (template) => template.templateCategoryLink)
  @JoinColumn({ name: 'template_id' })
  template: Templates;

  @OneToOne(() => TemplateCategory, (templateCategory) => templateCategory.templateCategoryLink, { eager: true })
  @JoinColumn({ name: 'template_category_id' })
  templateCategory: TemplateCategory;
}
