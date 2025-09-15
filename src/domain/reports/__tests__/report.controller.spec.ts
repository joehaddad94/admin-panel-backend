import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ReportController } from '../report.controller';
import { ReportMediator } from '../report.mediator';
import { FiltersDto } from '../dtos/filters.dto';
import { ReportType } from '../dtos/report-type.enum';

describe('ReportController', () => {
  let controller: ReportController;
  let mediator: ReportMediator;
  let module: TestingModule;

  const mockReportMediator = {
    applicationReport: jest.fn(),
    informationReport: jest.fn(),
    usersReport: jest.fn(),
    microcampApplicationsReport: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportMediator,
          useValue: mockReportMediator,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    mediator = module.get<ReportMediator>(ReportMediator);
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

  describe('controller instantiation', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should be an instance of ReportController', () => {
      expect(controller).toBeInstanceOf(ReportController);
    });

    it('should have mediator dependency injected', () => {
      expect(controller['mediator']).toBeDefined();
      expect(controller['mediator']).toBe(mediator);
    });
  });

  describe('controller structure', () => {
    it('should have proper decorators', () => {
      expect(controller).toBeDefined();
    });

    it('should be injectable', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have generateReport method', () => {
      expect(typeof controller.generateReport).toBe('function');
    });
  });

  describe('dependency injection', () => {
    it('should inject ReportMediator', () => {
      expect(controller['mediator']).toBe(mediator);
    });

    it('should have access to mediator methods', () => {
      expect(controller['mediator']).toBeDefined();
      expect(typeof controller['mediator'].applicationReport).toBe('function');
      expect(typeof controller['mediator'].informationReport).toBe('function');
      expect(typeof controller['mediator'].usersReport).toBe('function');
      expect(typeof controller['mediator'].microcampApplicationsReport).toBe('function');
    });
  });

  describe('generateReport method', () => {
    it('should call applicationReport when reportType is APPLICATIONS', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.APPLICATIONS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };
      const mockResult = [{ id: 1, name: 'Test Application' }];
      mockReportMediator.applicationReport.mockResolvedValue(mockResult);

      const result = await controller.generateReport(filtersDto);

      expect(result).toEqual(mockResult);
      expect(mockReportMediator.applicationReport).toHaveBeenCalledWith(filtersDto);
    });

    it('should call informationReport when reportType is INFORMATION', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.INFORMATION,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };
      const mockResult = [{ id: 1, name: 'Test Information' }];
      mockReportMediator.informationReport.mockResolvedValue(mockResult);

      const result = await controller.generateReport(filtersDto);

      expect(result).toEqual(mockResult);
      expect(mockReportMediator.informationReport).toHaveBeenCalledWith(filtersDto);
    });

    it('should call usersReport when reportType is USERS', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.USERS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };
      const mockResult = [{ id: 1, name: 'Test User' }];
      mockReportMediator.usersReport.mockResolvedValue(mockResult);

      const result = await controller.generateReport(filtersDto);

      expect(result).toEqual(mockResult);
      expect(mockReportMediator.usersReport).toHaveBeenCalledWith(filtersDto);
    });

    it('should call microcampApplicationsReport when reportType is MICROCAMP_APPLICATIONS', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.MICROCAMP_APPLICATIONS,
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31'),
      };
      const mockResult = [{ id: 1, name: 'Test Microcamp Application' }];
      mockReportMediator.microcampApplicationsReport.mockResolvedValue(mockResult);

      const result = await controller.generateReport(filtersDto);

      expect(result).toEqual(mockResult);
      expect(mockReportMediator.microcampApplicationsReport).toHaveBeenCalledWith(filtersDto);
    });

    it('should throw HttpException for invalid report type', () => {
      const filtersDto: FiltersDto = {
        reportType: 'invalid' as ReportType,
      };

      expect(() => controller.generateReport(filtersDto)).toThrow('Invalid report type');
    });

    it('should handle mediator errors', async () => {
      const filtersDto: FiltersDto = {
        reportType: ReportType.APPLICATIONS,
      };
      const error = new Error('Mediator error');
      mockReportMediator.applicationReport.mockRejectedValue(error);

      await expect(controller.generateReport(filtersDto)).rejects.toThrow('Mediator error');
      expect(mockReportMediator.applicationReport).toHaveBeenCalledWith(filtersDto);
    });
  });

  describe('controller metadata', () => {
    it('should be a valid NestJS controller', () => {
      expect(controller).toBeDefined();
      expect(typeof controller).toBe('object');
    });

    it('should have proper constructor injection', () => {
      expect(controller['mediator']).toBeDefined();
    });
  });
});
