import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsMediator } from '../statistics.mediator';
import { StatisticsService } from '../statistics.service';
import { ProgramService } from '../../programs/program.service';
import { StatisticsQueryDto } from '../dtos/statistics.dto';
import { HttpException } from '@nestjs/common';

describe('StatisticsMediator', () => {
  let mediator: StatisticsMediator;
  let statisticsService: StatisticsService;
  let programService: ProgramService;
  let module: TestingModule;

  const mockStatisticsService = {
    getApplicationStatusCounts: jest.fn(),
    getFCSEligibilityStatistics: jest.fn(),
    getFCSScreeningStatistics: jest.fn(),
    getFCSPaymentStatistics: jest.fn(),
    getFCSSectionDistribution: jest.fn(),
    getFCSEmailStatistics: jest.fn(),
    getFCSSelectionTimeline: jest.fn(),
    getFailedInterviewPercentage: jest.fn(),
    getExamPassStatistics: jest.fn(),
    getInterviewProgressStatistics: jest.fn(),
    getApplicationSelectionStatistics: jest.fn(),
    getSelectionTimeline: jest.fn(),
  };

  const mockProgramService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        StatisticsMediator,
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
      ],
    }).compile();

    mediator = module.get<StatisticsMediator>(StatisticsMediator);
    statisticsService = module.get<StatisticsService>(StatisticsService);
    programService = module.get<ProgramService>(ProgramService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics', () => {
    const queryDto: StatisticsQueryDto = { programId: 1, cycleId: 1 };

    it('should return FCS statistics when program abbreviation is FCS', async () => {
      const mockProgram = { id: 1, abbreviation: 'FCS' };
      const mockFCSStats = {
        applicationStatusCounts: [],
        eligibilityStatistics: { total_applications: 100 },
        screeningStatistics: { total_eligible: 80 },
        paymentStatistics: { total_screening_emails_sent: 60 },
        sectionDistribution: { total_enrolled: 50 },
        emailStatistics: { total_applications: 100 },
        selectionTimeline: { first_screening_date: '2024-01-01' },
      };

      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockStatisticsService.getApplicationStatusCounts.mockResolvedValue(mockFCSStats.applicationStatusCounts);
      mockStatisticsService.getFCSEligibilityStatistics.mockResolvedValue(mockFCSStats.eligibilityStatistics);
      mockStatisticsService.getFCSScreeningStatistics.mockResolvedValue(mockFCSStats.screeningStatistics);
      mockStatisticsService.getFCSPaymentStatistics.mockResolvedValue(mockFCSStats.paymentStatistics);
      mockStatisticsService.getFCSSectionDistribution.mockResolvedValue(mockFCSStats.sectionDistribution);
      mockStatisticsService.getFCSEmailStatistics.mockResolvedValue(mockFCSStats.emailStatistics);
      mockStatisticsService.getFCSSelectionTimeline.mockResolvedValue(mockFCSStats.selectionTimeline);

      const result = await mediator.getStatistics(queryDto);

      expect(programService.findOne).toHaveBeenCalledWith({ id: queryDto.programId });
      expect(statisticsService.getApplicationStatusCounts).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSEligibilityStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSScreeningStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSPaymentStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSSectionDistribution).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSEmailStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFCSSelectionTimeline).toHaveBeenCalledWith(queryDto);

      expect(result).toEqual({
        data: mockFCSStats,
      });
    });

    it('should return FSE statistics when program abbreviation is not FCS', async () => {
      const mockProgram = { id: 1, abbreviation: 'FSE' };
      const mockFSEStats = {
        applicationStatusCounts: [],
        failedInterviewPercentage: { failed_interview_percentage: 25.5 },
        passedExamPercentage: { passed_exam_percentage: 80.0 },
        passedInterviewPercentage: { interview_completion_percentage: 60.0 },
        applicationSelectionStatistics: { total_applications: 100 },
        selectionTimeline: { first_exam_date: '2024-01-01' },
      };

      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockStatisticsService.getApplicationStatusCounts.mockResolvedValue(mockFSEStats.applicationStatusCounts);
      mockStatisticsService.getFailedInterviewPercentage.mockResolvedValue(mockFSEStats.failedInterviewPercentage);
      mockStatisticsService.getExamPassStatistics.mockResolvedValue(mockFSEStats.passedExamPercentage);
      mockStatisticsService.getInterviewProgressStatistics.mockResolvedValue(mockFSEStats.passedInterviewPercentage);
      mockStatisticsService.getApplicationSelectionStatistics.mockResolvedValue(mockFSEStats.applicationSelectionStatistics);
      mockStatisticsService.getSelectionTimeline.mockResolvedValue(mockFSEStats.selectionTimeline);

      const result = await mediator.getStatistics(queryDto);

      expect(programService.findOne).toHaveBeenCalledWith({ id: queryDto.programId });
      expect(statisticsService.getApplicationStatusCounts).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getFailedInterviewPercentage).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getExamPassStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getInterviewProgressStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getApplicationSelectionStatistics).toHaveBeenCalledWith(queryDto);
      expect(statisticsService.getSelectionTimeline).toHaveBeenCalledWith(queryDto);

      expect(result).toEqual({
        data: mockFSEStats,
      });
    });

    it('should throw NotFoundException when program is not found', async () => {
      mockProgramService.findOne.mockResolvedValue(null);

      await expect(mediator.getStatistics(queryDto)).rejects.toThrow(HttpException);
      expect(programService.findOne).toHaveBeenCalledWith({ id: queryDto.programId });
    });

    it('should return cached data when available and not expired', async () => {
      const mockProgram = { id: 1, abbreviation: 'FCS' };
      const cachedData = {
        data: {
          applicationStatusCounts: [],
          eligibilityStatistics: { total_applications: 100 },
        },
      };

      // Set up cache with recent timestamp
      const cacheKey = `statistics_${queryDto.programId}_${queryDto.cycleId}`;
      (mediator as any).statisticsCache.set(cacheKey, {
        data: cachedData,
        timestamp: Date.now() - 30 * 1000, // 30 seconds ago (less than 1 minute)
      });

      const result = await mediator.getStatistics(queryDto);

      expect(programService.findOne).not.toHaveBeenCalled();
      expect(statisticsService.getApplicationStatusCounts).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it('should fetch fresh data when cache is expired', async () => {
      const mockProgram = { id: 1, abbreviation: 'FCS' };
      const mockFCSStats = {
        applicationStatusCounts: [],
        eligibilityStatistics: { total_applications: 100 },
        screeningStatistics: { total_eligible: 80 },
        paymentStatistics: { total_screening_emails_sent: 60 },
        sectionDistribution: { total_enrolled: 50 },
        emailStatistics: { total_applications: 100 },
        selectionTimeline: { first_screening_date: '2024-01-01' },
      };

      // Set up cache with old timestamp
      const cacheKey = `statistics_${queryDto.programId}_${queryDto.cycleId}`;
      (mediator as any).statisticsCache.set(cacheKey, {
        data: { data: { old: 'data' } },
        timestamp: Date.now() - 2 * 60 * 1000, // 2 minutes ago (more than 1 minute)
      });

      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockStatisticsService.getApplicationStatusCounts.mockResolvedValue(mockFCSStats.applicationStatusCounts);
      mockStatisticsService.getFCSEligibilityStatistics.mockResolvedValue(mockFCSStats.eligibilityStatistics);
      mockStatisticsService.getFCSScreeningStatistics.mockResolvedValue(mockFCSStats.screeningStatistics);
      mockStatisticsService.getFCSPaymentStatistics.mockResolvedValue(mockFCSStats.paymentStatistics);
      mockStatisticsService.getFCSSectionDistribution.mockResolvedValue(mockFCSStats.sectionDistribution);
      mockStatisticsService.getFCSEmailStatistics.mockResolvedValue(mockFCSStats.emailStatistics);
      mockStatisticsService.getFCSSelectionTimeline.mockResolvedValue(mockFCSStats.selectionTimeline);

      const result = await mediator.getStatistics(queryDto);

      expect(programService.findOne).toHaveBeenCalledWith({ id: queryDto.programId });
      expect(statisticsService.getApplicationStatusCounts).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual({
        data: mockFCSStats,
      });
    });

    it('should handle empty query parameters', async () => {
      const emptyQueryDto: StatisticsQueryDto = {};
      const mockProgram = { id: 1, abbreviation: 'FSE' };
      const mockFSEStats = {
        applicationStatusCounts: [],
        failedInterviewPercentage: { failed_interview_percentage: 25.5 },
        passedExamPercentage: { passed_exam_percentage: 80.0 },
        passedInterviewPercentage: { interview_completion_percentage: 60.0 },
        applicationSelectionStatistics: { total_applications: 100 },
        selectionTimeline: { first_exam_date: '2024-01-01' },
      };

      mockProgramService.findOne.mockResolvedValue(mockProgram);
      mockStatisticsService.getApplicationStatusCounts.mockResolvedValue(mockFSEStats.applicationStatusCounts);
      mockStatisticsService.getFailedInterviewPercentage.mockResolvedValue(mockFSEStats.failedInterviewPercentage);
      mockStatisticsService.getExamPassStatistics.mockResolvedValue(mockFSEStats.passedExamPercentage);
      mockStatisticsService.getInterviewProgressStatistics.mockResolvedValue(mockFSEStats.passedInterviewPercentage);
      mockStatisticsService.getApplicationSelectionStatistics.mockResolvedValue(mockFSEStats.applicationSelectionStatistics);
      mockStatisticsService.getSelectionTimeline.mockResolvedValue(mockFSEStats.selectionTimeline);

      const result = await mediator.getStatistics(emptyQueryDto);

      expect(programService.findOne).toHaveBeenCalledWith({ id: undefined });
      expect(result).toEqual({
        data: mockFSEStats,
      });
    });
  });
});
