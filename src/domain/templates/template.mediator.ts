import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { GlobalEntities } from 'src/core/data/types';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { In, Like } from 'typeorm';
import { CreateEditTemplateDto } from './dtos/createEditTemplate.dto';
import {
  DeleteTemplatesDto,
  GetTemplatesDto,
} from './dtos/templateFilters.dto';
import { Templates } from 'src/core/data/database/entities/template.entity';

@Injectable()
export class TemplateMediator {
  constructor(private readonly templateService: TemplateService) {}

  findTemplates = async (
    filters: GetTemplatesDto,
    page = 1,
    pageSize = 100000000,
  ) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const templateOptions: GlobalEntities[] = ['templateAdmin'];

      let where: any = {};

      if (filters.search) {
        where.name = Like(`%${filters.search}%`);
      }

      if (filters.isActive !== undefined) {
        where.is_active = filters.isActive === 'true';
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
        designJson,
        htmlContent,
        isActive = true,
        createdById,
        updatedById,
      } = data;

      let template: Templates;
      let savedTemplate: Templates;
      let flattenedTemplate: any;
      let successMessage: string;

      if (templateId) {
        // Update existing template
        template = await this.templateService.findOne({ id: templateId }, [
          'templateAdmin',
        ]);

        if (!template) {
          throwNotFound({ entity: 'template', errorCheck: !template });
        }

        template.name = name;
        template.design_json = designJson as any;
        template.html_content = htmlContent;
        template.is_active = isActive;
        template.updated_at = new Date();
        template.updated_by_id = updatedById || template.updated_by_id;

        await this.templateService.save(template);
        savedTemplate = await this.templateService.findOne(
          { id: template.id },
          ['templateAdmin'],
        );

        successMessage = 'Template successfully updated';
      } else {
        // Create new template
        const existingTemplate = await this.templateService.findOne({
          name: name,
        });

        if (existingTemplate) {
          throw new Error('Template name must be unique.');
        }

        template = this.templateService.create({
          name: name,
          design_json: designJson as any,
          html_content: htmlContent,
          is_active: isActive,
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: createdById || 1, // Default to admin ID 1 if not provided
          updated_by_id: updatedById || createdById || 1,
        });

        template = (await this.templateService.save(template)) as Templates;

        if (!template || !template.id) {
          throw new Error('Template could not be created');
        }

        successMessage = 'Template created successfully';

        savedTemplate = await this.templateService.findOne(
          { id: template.id },
          ['templateAdmin'],
        );
      }

      flattenedTemplate = {
        ...savedTemplate,
        adminCount: savedTemplate.templateAdmin?.length || 0,
      };

      flattenedTemplate = convertToCamelCase(flattenedTemplate);
      return {
        message: successMessage,
        template: flattenedTemplate,
      };
    });
  };

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
}
