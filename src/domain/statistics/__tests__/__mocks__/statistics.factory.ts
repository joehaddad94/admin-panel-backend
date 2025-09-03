import { StatisticsQueryDto } from '../../dtos/statistics.dto';

export class StatisticsFactory {
  static createMockStatisticsQueryDto(overrides: Partial<StatisticsQueryDto> = {}): StatisticsQueryDto {
    const defaultQuery: StatisticsQueryDto = {
      programId: 1,
      cycleId: 1,
    };
    return { ...defaultQuery, ...overrides };
  }

  static createMockApplicationStatusCounts() {
    return [
      { cycle_name: 'Cycle 1', status: 'Pending', count: '10' },
      { cycle_name: 'Cycle 1', status: 'Accepted', count: '5' },
      { cycle_name: 'Cycle 1', status: 'Rejected', count: '3' },
    ];
  }

  static createMockFailedInterviewPercentage() {
    return { failed_interview_percentage: 25.5 };
  }

  static createMockExamPassStatistics() {
    return {
      passed_exam_count: '80',
      total_exam_count: '100',
      passed_exam_percentage: 80.0,
    };
  }

  static createMockInterviewProgressStatistics() {
    return {
      total_interviews: '50',
      completed_interviews: '30',
      exam_emails_sent: '50',
      exam_emails_to_send: '0',
      interview_completion_percentage: 60.0,
      interviews_left: 20,
    };
  }

  static createMockApplicationSelectionStatistics() {
    return {
      total_applications: '100',
      accepted_percentage: 75.0,
    };
  }

  static createMockSelectionTimeline() {
    return {
      first_exam_date: 'January 15, 2024',
      last_interview_date: 'February 15, 2024',
      selection_duration_days: 31,
    };
  }

  static createMockFCSEligibilityStatistics() {
    return {
      total_applications: '200',
      eligible_count: '150',
      ineligible_count: '30',
      eligibility_percentage: 75.0,
      pending_eligibility_count: '20',
    };
  }

  static createMockFCSScreeningStatistics() {
    return {
      total_eligible: '150',
      screening_emails_sent_to_eligible: '120',
      screening_email_percentage: 80.0,
    };
  }

  static createMockFCSPaymentStatistics() {
    return {
      total_screening_emails_sent: '120',
      paid_count: '100',
      unpaid_count: '20',
      payment_percentage: 83.33,
    };
  }

  static createMockFCSSectionDistribution() {
    return {
      total_enrolled: 60,
      section_distribution: [
        { section_name: 'Section A', count: 30, percentage: 50.0 },
        { section_name: 'Section B', count: 20, percentage: 33.33 },
        { section_name: 'Unassigned', count: 10, percentage: 16.67 },
      ],
    };
  }

  static createMockFCSEmailStatistics() {
    return {
      total_applications: '200',
      screening_emails_sent: '150',
      screening_email_percentage: 75.0,
      schedule_emails_sent: '100',
      schedule_email_percentage: 50.0,
      status_emails_sent: '80',
      status_email_percentage: 40.0,
      emails_pending: '20',
    };
  }

  static createMockFCSSelectionTimeline() {
    return {
      first_screening_date: 'January 10, 2024',
      last_acceptance_date: 'February 20, 2024',
      selection_duration_days: 41,
    };
  }

  static createMockFCSStatistics() {
    return {
      applicationStatusCounts: this.createMockApplicationStatusCounts(),
      eligibilityStatistics: this.createMockFCSEligibilityStatistics(),
      screeningStatistics: this.createMockFCSScreeningStatistics(),
      paymentStatistics: this.createMockFCSPaymentStatistics(),
      sectionDistribution: this.createMockFCSSectionDistribution(),
      emailStatistics: this.createMockFCSEmailStatistics(),
      selectionTimeline: this.createMockFCSSelectionTimeline(),
    };
  }

  static createMockFSEStatistics() {
    return {
      applicationStatusCounts: this.createMockApplicationStatusCounts(),
      failedInterviewPercentage: this.createMockFailedInterviewPercentage(),
      passedExamPercentage: this.createMockExamPassStatistics(),
      passedInterviewPercentage: this.createMockInterviewProgressStatistics(),
      applicationSelectionStatistics: this.createMockApplicationSelectionStatistics(),
      selectionTimeline: this.createMockSelectionTimeline(),
    };
  }

  static createMockProgram(abbreviation: string = 'FCS') {
    return {
      id: 1,
      name: 'Test Program',
      abbreviation,
      description: 'Test program description',
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: 1,
      updated_by_id: 1,
    };
  }
}
