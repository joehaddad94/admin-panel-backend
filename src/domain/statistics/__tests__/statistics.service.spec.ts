import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from '../statistics.service';
import { DataSource } from 'typeorm';
import { StatisticsQueryDto } from '../dtos/statistics.dto';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let dataSource: DataSource;
  let module: TestingModule;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDataSource', () => {
    it('should return the data source', () => {
      const result = service.getDataSource();
      expect(result).toBe(dataSource);
    });
  });

  describe('getApplicationStatusCounts', () => {
    it('should return application status counts', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [
        { cycle_name: 'Cycle 1', status: 'Pending', count: '10' },
        { cycle_name: 'Cycle 1', status: 'Accepted', count: '5' },
      ];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getApplicationStatusCounts(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.name AS cycle_name'),
        [params.programId, params.cycleId],
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle empty parameters', async () => {
      const params: StatisticsQueryDto = {};
      const mockResult = [];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getApplicationStatusCounts(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.name AS cycle_name'),
        [undefined, undefined],
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getFailedInterviewPercentage', () => {
    it('should return failed interview percentage', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{ failed_interview_percentage: 25.5 }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFailedInterviewPercentage(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('failed_interview_percentage'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getExamPassStatistics', () => {
    it('should return exam pass statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        passed_exam_count: '80',
        total_exam_count: '100',
        passed_exam_percentage: 80.0,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getExamPassStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('passed_exam_count'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getInterviewProgressStatistics', () => {
    it('should return interview progress statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_interviews: '50',
        completed_interviews: '30',
        exam_emails_sent: '50',
        exam_emails_to_send: '0',
        interview_completion_percentage: 60.0,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getInterviewProgressStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('total_interviews'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual({
        ...mockResult[0],
        interviews_left: 20, // calculated as total_interviews - completed_interviews
      });
    });
  });

  describe('getApplicationSelectionStatistics', () => {
    it('should return application selection statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_applications: '100',
        accepted_percentage: 75.0,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getApplicationSelectionStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('total_applications'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getSelectionTimeline', () => {
    it('should return selection timeline', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        first_exam_date: 'January 15, 2024',
        last_interview_date: 'February 15, 2024',
        selection_duration_days: 31,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getSelectionTimeline(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('first_exam_date'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getFCSEligibilityStatistics', () => {
    it('should return FCS eligibility statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_applications: '200',
        eligible_count: '150',
        ineligible_count: '30',
        eligibility_percentage: 75.0,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSEligibilityStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('is_eligible'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getFCSScreeningStatistics', () => {
    it('should return FCS screening statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_eligible: '150',
        screening_emails_sent_to_eligible: '120',
        screening_email_percentage: 80.0,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSScreeningStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('screening_email_sent'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getFCSPaymentStatistics', () => {
    it('should return FCS payment statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_screening_emails_sent: '120',
        paid_count: '100',
        unpaid_count: '20',
        payment_percentage: 83.33,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSPaymentStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('paid'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getFCSSectionDistribution', () => {
    it('should return FCS section distribution', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [
        { section_name: 'Section A', count: '30' },
        { section_name: 'Section B', count: '20' },
        { section_name: 'Unassigned', count: '10' },
      ];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSSectionDistribution(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('COALESCE(s.name'),
        [params.cycleId, params.programId],
      );
      expect(result.total_enrolled).toBe(60);
      expect(result.section_distribution).toHaveLength(3);
      expect(result.section_distribution[0]).toEqual({
        section_name: 'Section A',
        count: 30,
        percentage: 50.0,
      });
    });
  });

  describe('getFCSEmailStatistics', () => {
    it('should return FCS email statistics', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        total_applications: '200',
        screening_emails_sent: '150',
        schedule_emails_sent: '100',
        status_emails_sent: '80',
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSEmailStatistics(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('screening_email_sent'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('getFCSSelectionTimeline', () => {
    it('should return FCS selection timeline', async () => {
      const params: StatisticsQueryDto = { programId: 1, cycleId: 1 };
      const mockResult = [{
        first_screening_date: 'January 10, 2024',
        last_acceptance_date: 'February 20, 2024',
        selection_duration_days: 41,
      }];

      mockDataSource.query.mockResolvedValue(mockResult);

      const result = await service.getFCSSelectionTimeline(params);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('first_screening_date'),
        [params.cycleId, params.programId],
      );
      expect(result).toEqual(mockResult[0]);
    });
  });
});
