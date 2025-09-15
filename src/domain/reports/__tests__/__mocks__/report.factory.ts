import { FiltersDto } from '../../dtos/filters.dto';
import { ReportType } from '../../dtos/report-type.enum';
import { FilterOperator, SortDirection } from '../../dtos/filters.dto';

export class ReportFactory {
  static createMockFiltersDto(overrides: Partial<FiltersDto> = {}): FiltersDto {
    const defaultFilters: FiltersDto = {
      reportType: ReportType.APPLICATIONS,
      fromDate: new Date('2024-01-01T00:00:00Z'),
      toDate: new Date('2024-01-31T23:59:59Z'),
      programId: 1,
      cycleId: 1,
      page: 1,
      pageSize: 10,
      limit: 100,
      useAllCycles: false,
      microcampId: 1,
      search: 'test',
      filters: [],
      sort: [],
    };

    return { ...defaultFilters, ...overrides };
  }

  static createMockApplicationReportData(count: number = 1) {
    return Array.from({ length: count }, (_, index) => ({
      'SEF ID': `SEF${String(index + 1).padStart(3, '0')}`,
      'Username': `user${index + 1}`,
      'Email': `user${index + 1}@example.com`,
      'First Name': `John${index + 1}`,
      'Middle Name': `Middle${index + 1}`,
      'Last Name': `Doe${index + 1}`,
      'Mother Maiden First Name': `Jane${index + 1}`,
      'Mother Maiden Last Name': `Smith${index + 1}`,
      'Gender': index % 2 === 0 ? 'Male' : 'Female',
      'Date of Birth': '1990-01-01',
      'Mobile Number': `+1234567890${index}`,
      'Country of Origin': 'Test Country',
      'Country of Residence': 'Test Country',
      'Residency Status': 'Citizen',
      'District': 'Test District',
      'Governate': 'Test Governate',
      'Marital Status': 'Single',
      'Type of Disability': 'None',
      'Disability': 'No',
      'Employment Situation': 'Student',
      'Social Media Platform': 'Facebook',
      'Terms and Conditions Accepted': 'Yes',
      'Degree Type': 'Bachelor',
      'Status': 'Active',
      'Institution': 'Test University',
      'Field of Study': 'Computer Science',
      'Major Title': 'Software Engineering',
      'Information Created At': '2024-01-01T00:00:00Z',
    }));
  }

  static createMockInformationReportData(count: number = 1) {
    return Array.from({ length: count }, (_, index) => ({
      'ID': index + 1,
      'First Name': `John${index + 1}`,
      'Middle Name': `Middle${index + 1}`,
      'Last Name': `Doe${index + 1}`,
      'Email': `user${index + 1}@example.com`,
      'Mobile': `+1234567890${index}`,
      'Gender': index % 2 === 0 ? 'Male' : 'Female',
      'Date of Birth': '1990-01-01',
      'Country of Origin': 'Test Country',
      'Country of Residence': 'Test Country',
      'Created At': '2024-01-01T00:00:00Z',
    }));
  }

  static createMockUsersReportData(count: number = 1) {
    return Array.from({ length: count }, (_, index) => ({
      'ID': index + 1,
      'SEF ID': `SEF${String(index + 1).padStart(3, '0')}`,
      'Username': `user${index + 1}`,
      'Email': `user${index + 1}@example.com`,
      'First Name': `John${index + 1}`,
      'Last Name': `Doe${index + 1}`,
      'Status': 'Active',
      'Created At': '2024-01-01T00:00:00Z',
    }));
  }

  static createMockMicrocampApplicationsReportData(count: number = 1) {
    return Array.from({ length: count }, (_, index) => ({
      'ID': index + 1,
      'Email': `user${index + 1}@example.com`,
      'Full Name': `John Doe${index + 1}`,
      'Phone Number': `+1234567890${index}`,
      'Country of Residence': 'Test Country',
      'Age Range': '18-25',
      'Referral Source': 'Social Media',
      'Created At': '2024-01-01T00:00:00Z',
    }));
  }

  static createMockFiltersDtoForApplications(overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      reportType: ReportType.APPLICATIONS,
      ...overrides,
    });
  }

  static createMockFiltersDtoForInformation(overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      reportType: ReportType.INFORMATION,
      ...overrides,
    });
  }

  static createMockFiltersDtoForUsers(overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      reportType: ReportType.USERS,
      ...overrides,
    });
  }

  static createMockFiltersDtoForMicrocampApplications(overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      reportType: ReportType.MICROCAMP_APPLICATIONS,
      ...overrides,
    });
  }

  static createMockFiltersDtoWithDateRange(fromDate: Date, toDate: Date, overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      fromDate,
      toDate,
      ...overrides,
    });
  }

  static createMockFiltersDtoWithPagination(page: number, pageSize: number, overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      page,
      pageSize,
      ...overrides,
    });
  }

  static createMockFiltersDtoWithSearch(search: string, overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      search,
      ...overrides,
    });
  }

  static createMockFiltersDtoWithFilters(filters: any[], overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      filters,
      ...overrides,
    });
  }

  static createMockFiltersDtoWithSort(sort: any[], overrides: Partial<FiltersDto> = {}): FiltersDto {
    return this.createMockFiltersDto({
      sort,
      ...overrides,
    });
  }

  static createMockFilterDto(field: string, operator: FilterOperator, value: any) {
    return {
      field,
      operator,
      value,
    };
  }

  static createMockSortDto(field: string, sort: SortDirection) {
    return {
      field,
      sort,
    };
  }

  static createMockFiltersDtoWithInvalidData(): Partial<FiltersDto> {
    return {
      reportType: 'invalid' as ReportType,
      fromDate: new Date('invalid-date'),
      toDate: new Date('invalid-date'),
      programId: -1,
      cycleId: -1,
      page: -1,
      pageSize: -1,
      limit: -1,
    };
  }

  static createMockFiltersDtoWithNullValues(): Partial<FiltersDto> {
    return {
      reportType: null,
      fromDate: null,
      toDate: null,
      programId: null,
      cycleId: null,
      page: null,
      pageSize: null,
      limit: null,
      useAllCycles: null,
      microcampId: null,
      search: null,
      filters: null,
      sort: null,
    };
  }

  static createMockFiltersDtoWithDifferentDateRanges(): FiltersDto[] {
    const dateRanges = [
      { fromDate: new Date('2024-01-01'), toDate: new Date('2024-01-31') },
      { fromDate: new Date('2024-02-01'), toDate: new Date('2024-02-29') },
      { fromDate: new Date('2024-03-01'), toDate: new Date('2024-03-31') },
      { fromDate: new Date('2024-04-01'), toDate: new Date('2024-04-30') },
      { fromDate: new Date('2024-05-01'), toDate: new Date('2024-05-31') },
    ];

    return dateRanges.map((range, index) =>
      this.createMockFiltersDto({
        ...range,
        reportType: Object.values(ReportType)[index % Object.values(ReportType).length],
      })
    );
  }

  static createMockFiltersDtoWithDifferentReportTypes(): FiltersDto[] {
    return Object.values(ReportType).map((reportType) =>
      this.createMockFiltersDto({
        reportType,
      })
    );
  }
}
