import { Sections } from '../../../../core/data/database/entities/section.entity';
import { CreateEditSectionDto } from '../../dtos/createEditSection.dtos';

export class SectionFactory {
  static createMockSection(
    overrides: Partial<Sections> = {},
  ): Partial<Sections> {
    const defaultSection: Partial<Sections> = {
      id: 1,
      name: 'Test Section',
      days: 'Monday, Wednesday, Friday',
      course_time_start: new Date('2024-01-01T09:00:00Z'),
      course_time_end: new Date('2024-01-01T11:00:00Z'),
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      created_by_id: 1,
      updated_by_id: 1,
      sectionCycle: {
        id: 1,
        cycle_id: 1,
        section_id: 1,
        section: null,
        cycle: {
          id: 1,
          name: 'Test Cycle',
          from_date: new Date('2024-01-01'),
          to_date: new Date('2024-12-31'),
          created_at: new Date('2024-01-01T00:00:00Z'),
          updated_at: new Date('2024-01-01T00:00:00Z'),
          created_by_id: 1,
          updated_by_id: 1,
          code: 'TEST2024',
          cycleProgram: null,
          applicationCycle: null,
          decisionDateCycle: null,
          thresholdCycle: null,
          sectionCycle: null,
        } as any,
      } as any,
    };

    return { ...defaultSection, ...overrides };
  }

  static createMockSections(count: number = 1): Partial<Sections>[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockSection({
        id: index + 1,
        name: `Test Section ${index + 1}`,
        days:
          index % 2 === 0 ? 'Monday, Wednesday, Friday' : 'Tuesday, Thursday',
        course_time_start: new Date(`2024-01-01T${9 + index}:00:00Z`),
        course_time_end: new Date(`2024-01-01T${11 + index}:00:00Z`),
      }),
    );
  }

  static createMockCreateEditSectionDto(
    overrides: Partial<CreateEditSectionDto> = {},
  ): CreateEditSectionDto {
    const defaultDto: CreateEditSectionDto = {
      sectionName: 'New Section',
      cycleId: 1,
      days: 'Monday, Wednesday, Friday',
      courseTimeStart: new Date('2024-01-01T09:00:00Z'),
      courseTimeEnd: new Date('2024-01-01T11:00:00Z'),
    };

    return { ...defaultDto, ...overrides };
  }

  static createMockCreateEditSectionDtoForUpdate(
    overrides: Partial<CreateEditSectionDto> = {},
  ): CreateEditSectionDto {
    return this.createMockCreateEditSectionDto({
      sectionId: 1,
      ...overrides,
    });
  }

  static createMockCreateEditSectionDtoForCreate(
    overrides: Partial<CreateEditSectionDto> = {},
  ): CreateEditSectionDto {
    return this.createMockCreateEditSectionDto({
      sectionId: undefined,
      ...overrides,
    });
  }

  static createMockSectionsWithDifferentCycles(
    count: number = 3,
  ): Partial<Sections>[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockSection({
        id: index + 1,
        name: `Test Section ${index + 1}`,
        sectionCycle: {
          id: index + 1,
          cycle_id: index + 1,
          section_id: index + 1,
          section: null,
          cycle: {
            id: index + 1,
            name: `Test Cycle ${index + 1}`,
            from_date: new Date('2024-01-01'),
            to_date: new Date('2024-12-31'),
            created_at: new Date('2024-01-01T00:00:00Z'),
            updated_at: new Date('2024-01-01T00:00:00Z'),
            created_by_id: 1,
            updated_by_id: 1,
            code: `TEST${2024 + index}`,
            cycleProgram: null,
            applicationCycle: null,
            decisionDateCycle: null,
            thresholdCycle: null,
            sectionCycle: null,
          } as any,
        } as any,
      }),
    );
  }

  static createMockSectionsWithDifferentDays(): Partial<Sections>[] {
    const days = [
      'Monday, Wednesday, Friday',
      'Tuesday, Thursday',
      'Monday, Tuesday, Wednesday',
      'Thursday, Friday',
      'Monday, Friday',
    ];

    return days.map((day, index) =>
      this.createMockSection({
        id: index + 1,
        name: `Test Section ${index + 1}`,
        days: day,
      }),
    );
  }

  static createMockSectionsWithDifferentTimes(): Partial<Sections>[] {
    const times = [
      { start: '09:00:00', end: '11:00:00' },
      { start: '10:00:00', end: '12:00:00' },
      { start: '14:00:00', end: '16:00:00' },
      { start: '15:00:00', end: '17:00:00' },
      { start: '18:00:00', end: '20:00:00' },
    ];

    return times.map((time, index) =>
      this.createMockSection({
        id: index + 1,
        name: `Test Section ${index + 1}`,
        course_time_start: new Date(`2024-01-01T${time.start}Z`),
        course_time_end: new Date(`2024-01-01T${time.end}Z`),
      }),
    );
  }

  static createMockSectionsWithPagination(
    page: number,
    pageSize: number,
    total: number,
  ): {
    sections: Partial<Sections>[];
    total: number;
  } {
    const sections = this.createMockSections(
      Math.min(pageSize, total - (page - 1) * pageSize),
    );
    return { sections, total };
  }

  static createMockCreateEditSectionDtoWithInvalidData(): Partial<CreateEditSectionDto> {
    return {
      sectionName: '',
      cycleId: -1,
      days: '',
      courseTimeStart: new Date('invalid-date'),
      courseTimeEnd: new Date('invalid-date'),
    };
  }

  static createMockCreateEditSectionDtoWithNullValues(): Partial<CreateEditSectionDto> {
    return {
      sectionName: null,
      cycleId: null,
      days: null,
      courseTimeStart: null,
      courseTimeEnd: null,
    };
  }

  static createMockCreateEditSectionDtoWithDifferentCycles(): CreateEditSectionDto[] {
    return Array.from({ length: 5 }, (_, index) =>
      this.createMockCreateEditSectionDto({
        cycleId: index + 1,
        sectionName: `Section for Cycle ${index + 1}`,
      }),
    );
  }

  static createMockCreateEditSectionDtoWithDifferentDays(): CreateEditSectionDto[] {
    const days = [
      'Monday, Wednesday, Friday',
      'Tuesday, Thursday',
      'Monday, Tuesday, Wednesday',
      'Thursday, Friday',
      'Monday, Friday',
    ];

    return days.map((day, index) =>
      this.createMockCreateEditSectionDto({
        sectionName: `Section ${index + 1}`,
        days: day,
      }),
    );
  }

  static createMockCreateEditSectionDtoWithDifferentTimes(): CreateEditSectionDto[] {
    const times = [
      { start: '09:00:00', end: '11:00:00' },
      { start: '10:00:00', end: '12:00:00' },
      { start: '14:00:00', end: '16:00:00' },
      { start: '15:00:00', end: '17:00:00' },
      { start: '18:00:00', end: '20:00:00' },
    ];

    return times.map((time, index) =>
      this.createMockCreateEditSectionDto({
        sectionName: `Section ${index + 1}`,
        courseTimeStart: new Date(`2024-01-01T${time.start}Z`),
        courseTimeEnd: new Date(`2024-01-01T${time.end}Z`),
      }),
    );
  }
}
