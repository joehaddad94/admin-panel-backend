import { MicrocampApplication } from '../../../../core/data/database/entities/microcamp-application.entity';

export class MicrocampApplicationFactory {
  static createMockMicrocampApplication(
    overrides: Partial<MicrocampApplication> = {},
  ): Partial<MicrocampApplication> {
    const defaultApplication: Partial<MicrocampApplication> = {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User',
      phone_number: 1234567890,
      country_residence: 'Test Country',
      age_range: '18-25',
      referral_source: 'Social Media',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
      published_at: new Date('2024-01-01T00:00:00Z'),
      created_by_id: 1,
      updated_by_id: 1,
      applicationMicrocamp: null,
    };

    return { ...defaultApplication, ...overrides };
  }

  static createMockMicrocampApplicationList(
    count: number,
    overrides: Partial<MicrocampApplication> = {},
  ): Partial<MicrocampApplication>[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockMicrocampApplication({
        id: index + 1,
        email: `test${index + 1}@example.com`,
        full_name: `Test User ${index + 1}`,
        phone_number: 1234567890 + index,
        ...overrides,
      }),
    );
  }

  static createMockMicrocampApplicationWithRelations(
    overrides: Partial<MicrocampApplication> = {},
  ): Partial<MicrocampApplication> {
    return this.createMockMicrocampApplication({
      applicationMicrocamp: {
        id: 1,
        microcampApplication: null,
        // Add other relation properties as needed
      } as any,
      ...overrides,
    });
  }

  static createMockMicrocampApplicationForCreate(
    overrides: Partial<MicrocampApplication> = {},
  ): Partial<MicrocampApplication> {
    return {
      email: 'new@example.com',
      full_name: 'New User',
      phone_number: 9876543210,
      country_residence: 'New Country',
      age_range: '26-35',
      referral_source: 'Website',
      ...overrides,
    };
  }

  static createMockMicrocampApplicationForUpdate(
    overrides: Partial<MicrocampApplication> = {},
  ): Partial<MicrocampApplication> {
    return {
      email: 'updated@example.com',
      full_name: 'Updated User',
      phone_number: 5555555555,
      country_residence: 'Updated Country',
      age_range: '36-45',
      referral_source: 'Email',
      ...overrides,
    };
  }

  static createMockMicrocampApplicationWithDifferentAgeRanges(): Partial<MicrocampApplication>[] {
    const ageRanges = ['18-25', '26-35', '36-45', '46-55', '55+'];
    return ageRanges.map((ageRange, index) =>
      this.createMockMicrocampApplication({
        id: index + 1,
        age_range: ageRange,
        email: `age${index + 1}@example.com`,
        full_name: `Age User ${index + 1}`,
      }),
    );
  }

  static createMockMicrocampApplicationWithDifferentCountries(): Partial<MicrocampApplication>[] {
    const countries = [
      'USA',
      'Canada',
      'UK',
      'Germany',
      'France',
      'Japan',
      'Australia',
    ];
    return countries.map((country, index) =>
      this.createMockMicrocampApplication({
        id: index + 1,
        country_residence: country,
        email: `country${index + 1}@example.com`,
        full_name: `Country User ${index + 1}`,
      }),
    );
  }

  static createMockMicrocampApplicationWithDifferentReferralSources(): Partial<MicrocampApplication>[] {
    const sources = [
      'Social Media',
      'Website',
      'Email',
      'Friend',
      'Advertisement',
      'Search Engine',
    ];
    return sources.map((source, index) =>
      this.createMockMicrocampApplication({
        id: index + 1,
        referral_source: source,
        email: `source${index + 1}@example.com`,
        full_name: `Source User ${index + 1}`,
      }),
    );
  }

  static createMockMicrocampApplicationWithInvalidData(): Partial<MicrocampApplication> {
    return {
      email: 'invalid-email',
      full_name: '',
      phone_number: -1,
      country_residence: '',
      age_range: 'invalid-age',
      referral_source: '',
    };
  }

  static createMockMicrocampApplicationWithNullValues(): Partial<MicrocampApplication> {
    return {
      email: null,
      full_name: null,
      phone_number: null,
      country_residence: null,
      age_range: null,
      referral_source: null,
      created_at: null,
      updated_at: null,
      published_at: null,
      created_by_id: null,
      updated_by_id: null,
    };
  }
}
