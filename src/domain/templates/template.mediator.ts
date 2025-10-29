import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { GlobalEntities } from 'src/core/data/types';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { In, Like, DataSource } from 'typeorm';
import { CreateEditTemplateDto } from './dtos/createEditTemplate.dto';
import {
  DeleteTemplatesDto,
  GetTemplatesDto,
} from './dtos/templateFilters.dto';
import { Templates } from 'src/core/data/database/entities/template.entity';
import { TestSendEmailTemplateDto } from './dtos/testSendEmailTemplate.dto';
import { MailService } from '../mail/mail.service';
import { TemplateProgram } from 'src/core/data/database/relations/template-program.entity';
import { ProgramService } from '../programs/program.service';
import { TemplateCategoryLink } from 'src/core/data/database/relations/template-category.entity';

@Injectable()
export class TemplateMediator {
  constructor(
    private readonly templateService: TemplateService,
    private readonly mailService: MailService,
    private readonly programService: ProgramService,
    private readonly dataSource: DataSource,
  ) {}

  findTemplates = async (
    filters: GetTemplatesDto,
    page = 1,
    pageSize = 100000000,
  ) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const templateOptions: GlobalEntities[] = ['templateAdmin', 'templateProgram', 'templateCategoryLink'];

      let where: any = {};

      if (filters.search) {
        where.name = Like(`%${filters.search}%`);
      }

      if (filters.isActive !== undefined) {
        where.is_active = filters.isActive === 'true';
      }

      if (filters.programId) {
        where.templateProgram = { program_id: filters.programId };
      }

      const [found, total] = await this.templateService.findAndCount(
        where,
        templateOptions,
        undefined,
        skip,
        take,
      );

      throwNotFound({
        entity: 'templates',
        errorCheck: !found,
      });

      let templates = found.map((template) => ({
        ...template,
        adminCount: template.templateAdmin?.length || 0,
      }));

      templates = convertToCamelCase(templates);
      return { templates, total };
    });
  };

  createEditTemplate = async (data: CreateEditTemplateDto) => {
    return catcher(async () => {
      const {
        templateId,
        name,
        subject,
        designJson,
        htmlContent,
        isActive = true,
        createdById,
        updatedById,
        programId,
        templateCategoryId,
      } = data;

      // Use transaction for data consistency
      return await this.dataSource.transaction(async (transactionalEntityManager) => {
        let template: Templates;
        let successMessage: string;
        const relations = ['templateAdmin', 'templateProgram', 'templateCategoryLink'];

        if (templateId) {
          // Update existing template
          template = await transactionalEntityManager.findOne(Templates, {
            where: { id: templateId },
            relations,
          });

          throwNotFound({ entity: 'template', errorCheck: !template });

          // Update template properties
          Object.assign(template, {
            name,
            subject,
            design_json: designJson,
            html_content: htmlContent,
            is_active: isActive,
            updated_at: new Date(),
            updated_by_id: updatedById || template.updated_by_id,
          });

          await transactionalEntityManager.save(Templates, template);

          // Handle program association
          if (programId) {
            await this.upsertTemplateProgram(
              transactionalEntityManager,
              template.id,
              programId,
            );
          }

          // Handle category association
          if (templateCategoryId) {
            await this.upsertTemplateCategoryLink(
              transactionalEntityManager,
              template.id,
              templateCategoryId,
            );
          }

          successMessage = 'Template successfully updated';
        } else {
          // Create new template - check uniqueness
          const existingTemplate = await transactionalEntityManager.findOne(Templates, {
            where: { name },
          });

          if (existingTemplate) {
            throw new Error('Template name must be unique.');
          }

          // Create template
          template = transactionalEntityManager.create(Templates, {
            name,
            subject,
            design_json: designJson,
            html_content: htmlContent,
            is_active: isActive,
            created_at: new Date(),
            updated_at: new Date(),
            created_by_id: createdById,
            updated_by_id: updatedById || createdById,
          });

          template = await transactionalEntityManager.save(Templates, template);

          if (!template?.id) {
            throw new Error('Template could not be created');
          }

          // Handle program association
          if (programId) {
            await this.upsertTemplateProgram(
              transactionalEntityManager,
              template.id,
              programId,
            );
          }

          // Handle category association
          if (templateCategoryId) {
            await this.upsertTemplateCategoryLink(
              transactionalEntityManager,
              template.id,
              templateCategoryId,
            );
          }

          successMessage = 'Template created successfully';
        }

        // Load final template with all relations in one query
        const savedTemplate = await transactionalEntityManager.findOne(Templates, {
          where: { id: template.id },
          relations,
        });

        // Build response
        const flattenedTemplate = convertToCamelCase({
          ...savedTemplate,
          adminCount: savedTemplate.templateAdmin?.length || 0,
          programCount: savedTemplate.templateProgram?.length || 0,
          categoryCount: savedTemplate.templateCategoryLink?.length || 0,
        });

        return {
          message: successMessage,
          template: flattenedTemplate,
        };
      });
    });
  };

  private async upsertTemplateProgram(
    entityManager: any,
    templateId: number,
    programId: number,
  ): Promise<void> {
    const existing = await entityManager.findOne(TemplateProgram, {
      where: { template_id: templateId, program_id: programId },
    });

    if (!existing) {
      const templateProgram = entityManager.create(TemplateProgram, {
        template_id: templateId,
        program_id: programId,
      });
      await entityManager.save(TemplateProgram, templateProgram);
    }
  }

  private async upsertTemplateCategoryLink(
    entityManager: any,
    templateId: number,
    templateCategoryId: number,
  ): Promise<void> {
    const existing = await entityManager.findOne(TemplateCategoryLink, {
      where: { template_id: templateId, template_category_id: templateCategoryId },
    });

    if (!existing) {
      const templateCategoryLink = entityManager.create(TemplateCategoryLink, {
        template_id: templateId,
        template_category_id: templateCategoryId,
      });
      await entityManager.save(TemplateCategoryLink, templateCategoryLink);
    }
  }

  deleteTemplates = async (data: DeleteTemplatesDto) => {
    return catcher(async () => {
      const { templateIds } = data;

      const templateOptions: GlobalEntities[] = ['templateAdmin'];

      const templates = await this.templateService.findMany(
        { id: In(templateIds) },
        templateOptions,
      );

      throwNotFound({
        entity: 'templates',
        errorCheck: !templates,
      });

      const templateIdsToDelete = templates.map((template) => template.id);

      await this.templateService.delete({ id: In(templateIdsToDelete) });

      return {
        message: 'Template(s) successfully deleted',
        deletedIds: templateIdsToDelete,
      };
    });
  };

  getTemplateById = async (id: number) => {
    return catcher(async () => {
      const template = await this.templateService.findOne({ id }, [
        'templateAdmin',
      ]);

      throwNotFound({
        entity: 'template',
        errorCheck: !template,
      });

      const flattenedTemplate = {
        ...template,
        adminCount: template.templateAdmin?.length || 0,
      };

      return convertToCamelCase(flattenedTemplate);
    });
  };

  testSendEmailTemplate = async (data: TestSendEmailTemplateDto) => {
    return catcher(async () => {
      const { templateId, emails } = data;

      const template = await this.templateService.findOne({ id: templateId }, [
        'templateAdmin',
      ]);
      
      throwNotFound({
        entity: 'template',
        errorCheck: !template,
      });

      let templateSubject = "Testing Template"


      const response = await this.mailService.sendTestEmailWithTemplate(
        emails, 
        template.name, 
        templateSubject, 
        template.html_content
      );

      return response;
    });
  };
}
