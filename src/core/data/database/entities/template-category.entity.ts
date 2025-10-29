import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TemplateCategoryLink } from "../relations/template-category.entity";

@Entity('template_categories')
export class TemplateCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  created_by_id: number;

  @Column()
  updated_by_id: number;

  @OneToMany(() => TemplateCategoryLink, (templateCategoryLink) => templateCategoryLink.templateCategory)
  templateCategoryLink: TemplateCategoryLink[];
}