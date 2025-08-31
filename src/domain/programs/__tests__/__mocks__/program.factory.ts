import { Program } from '../../../../core/data/database/entities/program.entity';

export class ProgramFactory {
  static createMockProgram(overrides: Partial<Program> = {}): Program {
    const defaultProgram: Program = {
      id: 1,
      program_name: 'Test Program',
      abbreviation: 'TP',
      description: 'Test program description',
      curriculum_url: 'https://example.com/curriculum',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      published_at: new Date('2024-01-01T00:00:00Z'),
      created_by_id: 1,
      updated_by_id: 1,
      applicationProgram: [],
      cycleProgram: null,
    };

    return { ...defaultProgram, ...overrides };
  }

  static createMockProgramList(count: number, overrides: Partial<Program> = {}): Program[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockProgram({
        id: index + 1,
        program_name: `Test Program ${index + 1}`,
        abbreviation: `TP${index + 1}`,
        ...overrides,
      })
    );
  }

  static createMockProgramWithRelations(overrides: Partial<Program> = {}): Program {
    return this.createMockProgram({
      applicationProgram: [
        {
          id: 1,
          program: null,
          // Add other relation properties as needed
        } as any,
      ],
      cycleProgram: {
        id: 1,
        program: null,
        // Add other relation properties as needed
      } as any,
      ...overrides,
    });
  }

  static createMockProgramForCreate(overrides: Partial<Program> = {}): Partial<Program> {
    return {
      program_name: 'New Program',
      abbreviation: 'NP',
      description: 'New program description',
      curriculum_url: 'https://example.com/new-curriculum',
      ...overrides,
    };
  }

  static createMockProgramForUpdate(overrides: Partial<Program> = {}): Partial<Program> {
    return {
      program_name: 'Updated Program',
      abbreviation: 'UP',
      description: 'Updated program description',
      curriculum_url: 'https://example.com/updated-curriculum',
      ...overrides,
    };
  }

  static createMockProgramWithDifferentNames(): Program[] {
    const names = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Medicine'];
    return names.map((name, index) =>
      this.createMockProgram({
        id: index + 1,
        program_name: name,
        abbreviation: name.substring(0, 2).toUpperCase(),
      })
    );
  }

  static createMockProgramWithDifferentAbbreviations(): Program[] {
    const abbreviations = ['CS', 'ENG', 'BUS', 'ART', 'MED', 'LAW', 'EDU'];
    return abbreviations.map((abbr, index) =>
      this.createMockProgram({
        id: index + 1,
        program_name: `Program ${abbr}`,
        abbreviation: abbr,
      })
    );
  }

  static createMockProgramWithDifferentDescriptions(): Program[] {
    const descriptions = [
      'Computer Science program focusing on software development',
      'Engineering program with mechanical and electrical tracks',
      'Business program covering management and finance',
      'Arts program with creative and performing arts',
      'Medicine program preparing future healthcare professionals',
    ];
    return descriptions.map((desc, index) =>
      this.createMockProgram({
        id: index + 1,
        description: desc,
        program_name: `Program ${index + 1}`,
        abbreviation: `P${index + 1}`,
      })
    );
  }

  static createMockProgramWithInvalidData(): Partial<Program> {
    return {
      program_name: '',
      abbreviation: '',
      description: '',
      curriculum_url: 'invalid-url',
    };
  }

  static createMockProgramWithNullValues(): Partial<Program> {
    return {
      program_name: null,
      abbreviation: null,
      description: null,
      curriculum_url: null,
      created_at: null,
      updated_at: null,
      published_at: null,
      created_by_id: null,
      updated_by_id: null,
    };
  }

  static createMockProgramWithLongNames(): Program[] {
    const longNames = [
      'Bachelor of Science in Computer Science and Engineering',
      'Master of Business Administration in International Business',
      'Doctor of Philosophy in Advanced Theoretical Physics',
      'Bachelor of Arts in Interdisciplinary Studies',
      'Master of Fine Arts in Creative Writing and Literature',
    ];
    return longNames.map((name, index) =>
      this.createMockProgram({
        id: index + 1,
        program_name: name,
        abbreviation: name.split(' ').map(word => word[0]).join('').substring(0, 5),
      })
    );
  }

  static createMockProgramWithSpecialCharacters(): Program[] {
    const specialNames = [
      'Program with Special Characters: @#$%',
      'Program with Numbers 123',
      'Program with Spaces and Dashes',
      'Program with Underscores_and_Dots.',
      'Program with Unicode: αβγδε',
    ];
    return specialNames.map((name, index) =>
      this.createMockProgram({
        id: index + 1,
        program_name: name,
        abbreviation: `SP${index + 1}`,
      })
    );
  }
}
