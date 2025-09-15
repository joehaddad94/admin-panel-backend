import { Test, TestingModule } from '@nestjs/testing';
import { ReportMediator } from '../report.mediator';
import { InformationService } from '../../information/information.service';
import { ApplicationService } from '../../applications/application.service';
import { UserService } from '../../users/user.service';
import { MicrocampApplicationService } from '../../microcampApplications/microcamp-applications.service';
import { FiltersDto } from '../dtos/filters.dto';
import { ReportType } from '../dtos/report-type.enum';

describe('ReportMediator', () => {
  let mediator: ReportMediator;
  let informationService: InformationService;
  let applicationService: ApplicationService;
  let userService: UserService;
  let microcampApplicationService: MicrocampApplicationService;
  let module: TestingModule;

  const mockInformationService = {
    findMany: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
  };

  const mockApplicationService = {
    findMany: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
  };

  const mockUserService = {
    findMany: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
  };

  const mockMicrocampApplicationService = {
    findMany: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ReportMediator,
        {
          provide: InformationService,
          useValue: mockInformationService,
        },
        {
          provide: ApplicationService,
          useValue: mockApplicationService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: MicrocampApplicationService,
          useValue: mockMicrocampApplicationService,
        },
      ],
    }).compile();

    mediator = module.get<ReportMediator>(ReportMediator);
    informationService = module.get<InformationService>(InformationService);
    applicationService = module.get<ApplicationService>(ApplicationService);
    userService = module.get<UserService>(UserService);
    microcampApplicationService = module.get<MicrocampApplicationService>(MicrocampApplicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    if (module) {
      await module.close();
    }
  });

  describe('mediator instantiation', () => {
    it('should be defined', () => {
      expect(mediator).toBeDefined();
    });

    it('should be an instance of ReportMediator', () => {
      expect(mediator).toBeInstanceOf(ReportMediator);
    });

    it('should have all service dependencies injected', () => {
      expect(mediator['informationService']).toBeDefined();
      expect(mediator['informationService']).toBe(informationService);
      expect(mediator['applicationService']).toBeDefined();
      expect(mediator['applicationService']).toBe(applicationService);
      expect(mediator['userService']).toBeDefined();
      expect(mediator['userService']).toBe(userService);
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBe(microcampApplicationService);
    });
  });

  describe('mediator structure', () => {
    it('should be injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(mediator['informationService']).toBeDefined();
      expect(mediator['applicationService']).toBeDefined();
      expect(mediator['userService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBeDefined();
    });

    it('should have all report methods', () => {
      expect(typeof mediator.applicationReport).toBe('function');
      expect(typeof mediator.informationReport).toBe('function');
      expect(typeof mediator.usersReport).toBe('function');
      expect(typeof mediator.microcampApplicationsReport).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject all services', () => {
      expect(mediator['informationService']).toBe(informationService);
      expect(mediator['applicationService']).toBe(applicationService);
      expect(mediator['userService']).toBe(userService);
      expect(mediator['microcampApplicationService']).toBe(microcampApplicationService);
    });

    it('should have access to service methods', () => {
      expect(mediator['informationService']).toBeDefined();
      expect(typeof mediator['informationService'].findMany).toBe('function');
      expect(typeof mediator['applicationService'].findMany).toBe('function');
      expect(typeof mediator['userService'].findMany).toBe('function');
      expect(typeof mediator['microcampApplicationService'].findMany).toBe('function');
    });
  });

  describe('applicationReport method', () => {
    it('should generate application report with date filters', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.APPLICATIONS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
        programId: 1,
        cycleId: 1,
      };

      const mockApplications = [
        {
          id: 1,
          applicationInfo: [{ 
            info: { 
              first_name: 'John', 
              last_name: 'Doe',
              middle_name: 'Middle',
              mother_maiden_first: 'Jane',
              mother_maiden_last: 'Smith',
              gender: 'Male',
              dob: '1990-01-01',
              mobile: '+1234567890',
              country_origin: 'Test Country',
              country_residence: 'Test Country',
              residency_status: 'Citizen',
              district: 'Test District',
              governate: 'Test Governate',
              marital_status: 'Single',
              type_of_disability: 'None',
              disability: 'No',
              employment_situation: 'Student',
              which_social: 'Facebook',
              terms_conditions: 'Yes',
              degree_type: 'Bachelor',
              status: 'Active',
              institution: 'Test University',
              field_of_study: 'Computer Science',
              major_title: 'Software Engineering',
              created_at: '2024-01-01T00:00:00Z',
            } 
          }],
          applicationUser: [{ 
            user: { 
              sef_id: 'SEF001', 
              username: 'johndoe', 
              email: 'john@example.com' 
            } 
          }],
          applicationProgram: [{ program: { id: 1, program_name: 'Test Program' } }],
          applicationCycle: [{ cycle: { id: 1, cycle_name: 'Test Cycle' } }],
        },
      ];

      mockApplicationService.findMany.mockResolvedValue(mockApplications);

      const result = await mediator.applicationReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockApplicationService.findMany).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.APPLICATIONS,
      };

      mockApplicationService.findMany.mockResolvedValue([]);

      const result = await mediator.applicationReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockApplicationService.findMany).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.APPLICATIONS,
      };

      const error = new Error('Service error');
      mockApplicationService.findMany.mockRejectedValue(error);

      await expect(mediator.applicationReport(filtersDto)).rejects.toThrow('Service error');
      expect(mockApplicationService.findMany).toHaveBeenCalled();
    });
  });

  describe('informationReport method', () => {
    it('should generate information report', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.INFORMATION,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };

      const mockInformation = [
        {
          id: 1,
          sef_id: 'SEF001',
          email: 'john@example.com',
          first_name: 'John',
          middle_name: 'Middle',
          last_name: 'Doe',
          mother_maiden_first: 'Jane',
          mother_maiden_last: 'Smith',
          gender: 'Male',
          dob: '1990-01-01',
          mobile: '+1234567890',
          country_origin: 'Test Country',
          country_residence: 'Test Country',
          residency_status: 'Citizen',
          district: 'Test District',
          governate: 'Test Governate',
          marital_status: 'Single',
          type_of_disability: 'None',
          disability: 'No',
          employment_situation: 'Student',
          which_social: 'Facebook',
          terms_conditions: 'Yes',
          degree_type: 'Bachelor',
          status: 'Active',
          institution: 'Test University',
          field_of_study: 'Computer Science',
          major_title: 'Software Engineering',
          created_at: '2024-01-01T00:00:00Z',
          informationUser: [{ user: { id: 1, username: 'johndoe' } }],
          applicationInfo: [{ id: 1, application: { id: 1 } }],
        },
      ];

      mockInformationService.findMany.mockResolvedValue(mockInformation);
      mockApplicationService.findMany.mockResolvedValue([
        {
          id: 1,
          applicationUser: [{ user: { id: 1, username: 'johndoe' } }],
          applicationProgram: [{ program: { id: 1, program_name: 'Test Program', abbreviation: 'TP' } }],
        },
      ]);

      const result = await mediator.informationReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockInformationService.findMany).toHaveBeenCalled();
      expect(mockApplicationService.findMany).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.INFORMATION,
      };

      mockInformationService.findMany.mockResolvedValue([]);

      const result = await mediator.informationReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockInformationService.findMany).toHaveBeenCalled();
    });
  });

  describe('usersReport method', () => {
    it('should generate users report', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.USERS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };

      const mockUsers = [
        {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          sef_id: 'SEF001',
        },
      ];

      mockUserService.findMany.mockResolvedValue(mockUsers);

      const result = await mediator.usersReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockUserService.findMany).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.USERS,
      };

      mockUserService.findMany.mockResolvedValue([]);

      const result = await mediator.usersReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockUserService.findMany).toHaveBeenCalled();
    });
  });

  describe('microcampApplicationsReport method', () => {
    it('should generate microcamp applications report', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.MICROCAMP_APPLICATIONS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
        microcampId: 1,
      };

      const mockMicrocampApplications = [
        {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          phone_number: 1234567890,
          country_residence: 'Test Country',
          age_range: '18-25',
          referral_source: 'Social Media',
          created_at: '2024-01-01T00:00:00Z',
          applicationMicrocamp: { 
            microcamp: { 
              id: 1, 
              name: 'Test Microcamp' 
            } 
          },
        },
      ];

      mockMicrocampApplicationService.findMany.mockResolvedValue(mockMicrocampApplications);

      const result = await mediator.microcampApplicationsReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockMicrocampApplicationService.findMany).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.MICROCAMP_APPLICATIONS,
      };

      mockMicrocampApplicationService.findMany.mockResolvedValue([]);

      const result = await mediator.microcampApplicationsReport(filtersDto);

      expect(result).toBeDefined();
      expect(mockMicrocampApplicationService.findMany).toHaveBeenCalled();
    });
  });

  describe('mediator metadata', () => {
    it('should be a valid NestJS injectable', () => {
      expect(mediator).toBeDefined();
      expect(typeof mediator).toBe('object');
    });

    it('should have proper service dependencies', () => {
      expect(mediator['informationService']).toBeDefined();
      expect(mediator['informationService']).toBe(informationService);
      expect(mediator['applicationService']).toBeDefined();
      expect(mediator['applicationService']).toBe(applicationService);
      expect(mediator['userService']).toBeDefined();
      expect(mediator['userService']).toBe(userService);
      expect(mediator['microcampApplicationService']).toBeDefined();
      expect(mediator['microcampApplicationService']).toBe(microcampApplicationService);
    });
  });
});
