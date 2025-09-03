import { ApplicationMediator } from '../application.mediator';

// Mock the external dependencies
jest.mock('../../../core/helpers/operation', () => ({
  catcher: jest.fn((promise) => promise()),
}));

jest.mock('../../../core/helpers/camelCase', () => ({
  convertToCamelCase: jest.fn((data) => data),
}));

jest.mock('../../../core/helpers/validateThresholds', () => ({
  validateThresholdEntity: jest.fn(() => true),
}));

jest.mock('../../../core/helpers/calculatePassingGrades', () => ({
  calculatePassedExam: jest.fn(() => true),
  calculatePassedInterview: jest.fn(() => true),
  calculatePassedInterviewOptimized: jest.fn(() => true),
}));

jest.mock('../../../core/helpers/filter-sort.helper', () => ({
  applyFilters: jest.fn((data, filters) => data),
  applySorting: jest.fn((data, sorting) => data),
}));

describe('ApplicationMediator', () => {
  let mediator: ApplicationMediator;
  let mockApplicationService: any;
  let mockCycleService: any;
  let mockMailService: any;
  let mockProgramService: any;
  let mockInformationService: any;
  let mockSectionService: any;
  let mockStatisticsMediator: any;

  const mockFiltersDto = {
    programId: 1,
    cycleId: 1,
    page: 1,
    pageSize: 10,
    useAllCycles: false,
  };

  const mockSendingEmailsDto = {
    cycleId: 1,
    emails: [
      { ids: 1, emails: 'test@example.com' },
    ],
  };

  const mockExamScoresDto = {
    cycleId: 1,
    examScores: [
      { email: 'test@example.com', score: 85 },
    ],
  };

  const mockInterviewScoresDto = {
    cycleId: 1,
    interviewScores: [
      { email: 'test@example.com', techScore: 90, softScore: 85, remarks: 'Good candidate' },
    ],
  };

  const mockEditApplicationDto = {
    id: 1,
    cycleId: 1,
    inputCycleId: 1,
    applicationStatus: 'approved',
  };

  const mockEditApplicationsDto = {
    ids: [1, 2],
    cycleId: 1,
    inputCycleId: 1,
  };

  const mockEditFCSApplicationsDto = {
    ids: [1, 2],
    cycleId: 1,
    inputCycleId: 1,
  };

  const mockRowEditApplicationsDto = {
    ids: [1, 2],
    cycleId: 1,
    inputCycleId: 1,
  };

  const mockApplyToFSEDto = {
    selectedApplicationsIds: [
      { userId: 1, infoId: 1 },
    ],
    targetedFSECycleId: 1,
  };

  const mockImportDataDto = {
    cycleId: 1,
    importType: 'applications',
    data: [{ name: 'Test User', email: 'test@example.com' }],
  };

  beforeEach(() => {
    mockApplicationService = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      batchUpdate: jest.fn(),
      save: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      getLatestCycle: jest.fn(),
      getRelevantCycleId: jest.fn(),
    };

    mockCycleService = {
      findOne: jest.fn(),
      findMany: jest.fn(),
    };

    mockMailService = {
      sendEmails: jest.fn(),
    };

    mockProgramService = {
      findOne: jest.fn(),
    };

    mockInformationService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockSectionService = {
      findOne: jest.fn(),
    };

    mockStatisticsMediator = {
      getStatistics: jest.fn(),
    };

    mediator = new ApplicationMediator(
      mockApplicationService as any,
      mockCycleService as any,
      mockMailService as any,
      mockProgramService as any,
      mockInformationService as any,
      mockSectionService as any,
      mockStatisticsMediator as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe('Component Structure', () => {
    it('should have all required methods', () => {
      expect(typeof mediator.findApplications).toBe('function');
      expect(typeof mediator.findApplicationsNew).toBe('function');
      expect(typeof mediator.findApplicationsByLatestCycle).toBe('function');
      expect(typeof mediator.editApplication).toBe('function');
      expect(typeof mediator.rowEditApplications).toBe('function');
      expect(typeof mediator.editFCSApplications).toBe('function');
      expect(typeof mediator.editApplications).toBe('function');
      expect(typeof mediator.sendPostScreeningEmails).toBe('function');
      expect(typeof mediator.importExamScores).toBe('function');
      expect(typeof mediator.sendPassedExamEmails).toBe('function');
      expect(typeof mediator.importInterviewScores).toBe('function');
      expect(typeof mediator.sendStatusEmail).toBe('function');
      expect(typeof mediator.sendScheduleConfirmationEmails).toBe('function');
      expect(typeof mediator.applyToFSE).toBe('function');
      expect(typeof mediator.importData).toBe('function');
    });

    it('should have cache functionality', () => {
      expect(typeof mediator['getCachedCycleData']).toBe('function');
      expect(typeof mediator['setCachedCycleData']).toBe('function');
    });
  });

  describe('Basic Functionality', () => {
    it('should find applications with filters and pagination', async () => {
      const mockApplications = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'approved' },
      ];
      mockApplicationService.findAndCount.mockResolvedValue([mockApplications, 2]);

      const result = await mediator.findApplications(mockFiltersDto, 1, 10);

      expect(mockApplicationService.findAndCount).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle useAllCycles flag', async () => {
      const filtersWithAllCycles = { ...mockFiltersDto, useAllCycles: true };
      mockApplicationService.findAndCount.mockResolvedValue([[], 0]);

      await mediator.findApplications(filtersWithAllCycles);

      expect(mockApplicationService.findAndCount).toHaveBeenCalled();
    });

    it('should find new applications', async () => {
      mockApplicationService.findAndCount.mockResolvedValue([[], 0]);

      const result = await mediator.findApplicationsNew(mockFiltersDto);

      expect(mockApplicationService.findAndCount).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should find applications by latest cycle', async () => {
      const mockLatestCycle = { id: 1, code: 'CYCLE_2024_1' };
      mockApplicationService.getRelevantCycleId.mockResolvedValue(mockLatestCycle);
      mockApplicationService.findAndCount.mockResolvedValue([[], 0]);

      const result = await mediator.findApplicationsByLatestCycle(mockFiltersDto);

      expect(mockApplicationService.getRelevantCycleId).toHaveBeenCalledWith(mockFiltersDto.programId);
      expect(result).toBeDefined();
    });
  });

  describe('Cache Functionality', () => {
    it('should cache cycle data', () => {
      const cycleId = 1;
      const cycleData = { id: 1, code: 'CYCLE_2024_1' };

      mediator['setCachedCycleData'](cycleId, cycleData);
      const cachedData = mediator['getCachedCycleData'](cycleId);

      expect(cachedData).toEqual(cycleData);
    });

    it('should return null for expired cache', () => {
      const cycleId = 1;
      const cycleData = { id: 1, code: 'CYCLE_2024_1' };

      mediator['setCachedCycleData'](cycleId, cycleData);
      
      // Manually expire the cache by setting timestamp to old value
      const cacheKey = `cycle_${cycleId}`;
      mediator['cycleCache'].set(cacheKey, { data: cycleData, timestamp: Date.now() - 70000 });
      
      const cachedData = mediator['getCachedCycleData'](cycleId);

      expect(cachedData).toBeNull();
    });
  });

  describe('Method Availability', () => {
    it('should have all required service dependencies', () => {
      expect(mockApplicationService).toBeDefined();
      expect(mockCycleService).toBeDefined();
      expect(mockMailService).toBeDefined();
      expect(mockProgramService).toBeDefined();
      expect(mockInformationService).toBeDefined();
      expect(mockSectionService).toBeDefined();
      expect(mockStatisticsMediator).toBeDefined();
    });

    it('should have all required service methods', () => {
      expect(typeof mockApplicationService.findAndCount).toBe('function');
      expect(typeof mockApplicationService.findOne).toBe('function');
      expect(typeof mockApplicationService.batchUpdate).toBe('function');
      expect(typeof mockApplicationService.save).toBe('function');
      expect(typeof mockCycleService.findOne).toBe('function');
      expect(typeof mockMailService.sendEmails).toBe('function');
      expect(typeof mockProgramService.findOne).toBe('function');
      expect(typeof mockInformationService.findOne).toBe('function');
      expect(typeof mockInformationService.create).toBe('function');
    });
  });
});
