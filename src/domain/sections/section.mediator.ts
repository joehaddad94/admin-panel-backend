import { Injectable } from '@nestjs/common';
import { SectionService } from './section.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';
import { GlobalEntities } from 'src/core/data/types';
import { convertToCamelCase } from 'src/core/helpers/camelCase';
import { In } from 'typeorm';
import { CreateEditSectionDto } from './dtos/createEditSection.dtos';
import { Sections } from 'src/core/data/database/entities/section.entity';
import { SectionCycle } from 'src/core/data/database/relations/section-cycle.entity';
import { formatTime } from 'src/core/helpers/formatDate';

@Injectable()
export class SectionMediator {
  constructor(private readonly sectionService: SectionService) {}

  findSections = async (cycleId?: number, page = 1, pageSize = 100000000) => {
    return catcher(async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const sectionOptions: GlobalEntities[] = ['sectionCycle'];

      let where = {};
      if (cycleId) {
        where = { sectionCycle: { cycle_id: cycleId } };
      }

      const [found, total] = await this.sectionService.findAndCount(
        where,
        sectionOptions,
        undefined,
        skip,
        take,
      );

      throwNotFound({
        entity: 'sections',
        errorCheck: !found,
      });

      let sections = found.map((section) => ({
        ...section,
        cycleName: section.sectionCycle?.cycle?.name,
        course_time_start: formatTime(section.course_time_start),
        course_time_end: formatTime(section.course_time_end),
      }));

      sections = convertToCamelCase(sections);
      return { sections, total };
    });
  };

  createEditSection = async (data: CreateEditSectionDto) => {
    return catcher(async () => {
      const { sectionId, sectionName, cycleId, courseTimeStart, courseTimeEnd } = data;

      let section: Sections;
      let savedSection: Sections;
      let flattenedSection: any;
      let successMessage: string;

      if (sectionId) {
        section = await this.sectionService.findOne({ id: sectionId }, [
          'sectionCycle',
        ]);
        if (!section) {
          throwNotFound({ entity: 'section', errorCheck: !section });
        }

        if (sectionName) section.name = sectionName;
        if (courseTimeStart) section.course_time_start = courseTimeStart;
        if (courseTimeEnd) section.course_time_end = courseTimeEnd;
        section.updated_at = new Date();

        if (section.sectionCycle) {
          await SectionCycle.update(
            { id: section.sectionCycle.id },
            { cycle_id: cycleId },
          );
        }

        await this.sectionService.save(section);
        savedSection = await this.sectionService.findOne({ id: section.id }, [
          'sectionCycle',
        ]);

        successMessage = 'Section successfully updated';
      } else {
        const existingSection = await this.sectionService.findOne({
          name: sectionName,
        });
        if (existingSection) {
          throw new Error('Cycle Name must be unique.');
        }

        const sectionCycle = new SectionCycle();
        sectionCycle.cycle_id = cycleId;
        await sectionCycle.save();

        section = this.sectionService.create({
          name: sectionName,
          course_time_start: courseTimeStart,
          course_time_end: courseTimeEnd,
          sectionCycle: sectionCycle,
          created_at: new Date(),
          updated_at: new Date(),
        });

        section = (await this.sectionService.save(section)) as Sections;
        if (!section || !section.id) {
          throw new Error('Section could not be created');
        }

        successMessage = 'Section created successfully';

        savedSection = await this.sectionService.findOne({ id: section.id }, [
          'sectionCycle',
        ]);
      }
      flattenedSection = {
        ...savedSection,
        cycleName: savedSection.sectionCycle
          ? savedSection.sectionCycle.cycle.name
          : 'N/A',
      };

      flattenedSection = convertToCamelCase(flattenedSection);
      return {
        message: successMessage,
        section: flattenedSection,
      };
    });
  };

  deleteCycles = async (ids: string | string[]) => {
    return catcher(async () => {
      const idArray = Array.isArray(ids) ? ids : [ids];

      const sectionsOptions: GlobalEntities[] = ['sectionCycle'];

      const sections = await this.sectionService.findMany(
        { id: In(idArray) },
        sectionsOptions,
      );

      throwNotFound({
        entity: 'sections',
        errorCheck: !sections,
      });

      const sectionsIdsToDelete = sections.map((section) => section.id);

      await this.sectionService.delete({ id: In(sectionsIdsToDelete) });

      return {
        message: 'Section(s) successfully deleted',
        deletedIds: sectionsIdsToDelete,
      };
    });
  };
}
