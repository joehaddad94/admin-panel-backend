import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StatisticsQueryDto } from './dtos/statistics.dto';

interface ApplicationStatusCount {
  cycle_name: string;
  status: string;
  count: number;
}

@Injectable()
export class StatisticsService {
  constructor(private readonly dataSource: DataSource) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async getApplicationStatusCounts(
    params: StatisticsQueryDto = {},
  ): Promise<ApplicationStatusCount[]> {
    const { programId, cycleId } = params;

    const query = `
      SELECT c.name AS cycle_name, app.status, COUNT(*) AS count
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN cycles c ON cycle_link.cycle_id = c.id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      JOIN programs p ON program_link.program_id = p.id
      WHERE app.status IS NOT NULL
      AND p.id = $1
      AND c.id = $2
      GROUP BY c.name, app.status
      ORDER BY count DESC;
    `;

    return this.dataSource.query(query, [programId, cycleId]);
  }

  async getFailedInterviewPercentage(
    params: StatisticsQueryDto = {},
  ): Promise<{ failed_interview_percentage: number }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.passed_interview = false) / 
          NULLIF(COUNT(*) FILTER (WHERE app.passed_interview IS NOT NULL), 0),
          2
        ) AS failed_interview_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getExamPassStatistics(params: StatisticsQueryDto = {}): Promise<{
    passed_exam_count: number;
    total_exam_count: number;
    passed_exam_percentage: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE app.passed_exam = true) AS passed_exam_count,
        COUNT(*) FILTER (WHERE app.passed_exam IS NOT NULL) AS total_exam_count,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.passed_exam = true) / 
          NULLIF(COUNT(*) FILTER (WHERE app.passed_exam IS NOT NULL), 0),
          2
        ) AS passed_exam_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getInterviewProgressStatistics(
    params: StatisticsQueryDto = {},
  ): Promise<{
    total_interviews: number;
    completed_interviews: number;
    interviews_left: number;
    interview_completion_percentage: number;
    exam_emails_sent: number;
    exam_emails_pending: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE app.passed_exam = true AND app.passed_exam_email_sent = true) as total_interviews,
        COUNT(*) FILTER (WHERE app.passed_interview IS NOT NULL) as completed_interviews,
        COUNT(*) FILTER (WHERE app.passed_exam = true AND app.passed_exam_email_sent = true) as exam_emails_sent,
        COUNT(*) FILTER (WHERE app.passed_exam = true AND app.passed_exam_email_sent IS NOT true) as exam_emails_to_send,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.passed_interview IS NOT NULL) / 
          NULLIF(COUNT(*) FILTER (WHERE app.passed_exam = true AND app.passed_exam_email_sent = true), 0),
          2
        ) as interview_completion_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    const stats = result[0];

    // Calculate interviews_left after getting the results
    stats.interviews_left = stats.total_interviews - stats.completed_interviews;

    return stats;
  }

  async getApplicationSelectionStatistics(
    params: StatisticsQueryDto = {},
  ): Promise<{
    total_applications: number;
    selection_completion_percentage: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) as total_applications,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.status = 'Accepted') / 
          NULLIF(COUNT(*), 0),
          2
        ) as selection_completion_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getSelectionTimeline(params: StatisticsQueryDto = {}): Promise<{
    first_exam_date: Date | null;
    last_interview_date: Date | null;
    selection_duration_days: number | null;
  }> {
    const { programId, cycleId } = params;

    const query = `
  SELECT 
    TO_CHAR(MIN(app.passed_exam_date), 'FMMonth DD, YYYY') AS first_exam_date,
    TO_CHAR(MAX(app.passed_interview_date), 'FMMonth DD, YYYY') AS last_interview_date,
    CASE 
      WHEN MIN(app.passed_exam_date) IS NOT NULL AND MAX(app.passed_interview_date) IS NOT NULL 
      THEN (MAX(app.passed_interview_date) - MIN(app.passed_exam_date))
      ELSE NULL 
    END AS selection_duration_days
  FROM application_news app
  JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
  JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
  WHERE cycle_link.cycle_id = $1
    AND program_link.program_id = $2
    AND app.passed_exam = true
    AND app.passed_interview = true;
`;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  private async getFCSSelectionTimeline(
    params: StatisticsQueryDto = {},
  ): Promise<{
    first_exam_date: Date | null;
    last_interview_date: Date | null;
    selection_duration_days: number | null;
  }> {
    // FCS doesn't have exams or interviews, so return null
    return {
      first_exam_date: null,
      last_interview_date: null,
      selection_duration_days: null,
    };
  }

  // New FCS-specific statistics functions

  async getFCSEligibilityStatistics(params: StatisticsQueryDto = {}): Promise<{
    total_applications: number;
    eligible_count: number;
    ineligible_count: number;
    eligibility_percentage: number;
    pending_eligibility_count: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE app.is_eligible = true) as eligible_count,
        COUNT(*) FILTER (WHERE app.is_eligible = false) as ineligible_count,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.is_eligible = true) / 
          NULLIF(COUNT(*), 0),
          2
        ) as eligibility_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getFCSScreeningStatistics(params: StatisticsQueryDto = {}): Promise<{
    total_eligible: number;
    screening_emails_sent_to_eligible: number;
    screening_email_percentage: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE app.is_eligible = true) as total_eligible,
        COUNT(*) FILTER (WHERE app.is_eligible = true AND app.screening_email_sent = true) as screening_emails_sent_to_eligible,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.is_eligible = true AND app.screening_email_sent = true) / 
          NULLIF(COUNT(*) FILTER (WHERE app.is_eligible = true), 0),
          2
        ) as screening_email_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getFCSPaymentStatistics(params: StatisticsQueryDto = {}): Promise<{
    total_passed_screening: number;
    paid_count: number;
    unpaid_count: number;
    payment_percentage: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE app.screening_email_sent = true) as total_screening_emails_sent,
        COUNT(*) FILTER (WHERE app.screening_email_sent = true AND app.paid = true) as paid_count,
        COUNT(*) FILTER (WHERE app.screening_email_sent = true AND app.paid IS NULL) as unpaid_count,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.screening_email_sent = true AND app.paid = true) / 
          NULLIF(COUNT(*) FILTER (WHERE app.screening_email_sent = true), 0),
          2
        ) as payment_percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getFCSSectionDistribution(params: StatisticsQueryDto = {}): Promise<{
    total_enrolled: number;
    section_distribution: Array<{
      section_name: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        s.name as section_name,
        COUNT(*) as count,
        ROUND(
          100.0 * COUNT(*) / 
          NULLIF(COUNT(*) OVER(), 0),
          2
        ) as percentage
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      LEFT JOIN application_news_section_id_links section_link ON app.id = section_link.application_new_id
      LEFT JOIN sections s ON section_link.section_id = s.id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2
        AND app.status = 'Accepted'
      GROUP BY s.name
      ORDER BY count DESC;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);

    const totalEnrolled = result.reduce(
      (sum, row) => sum + parseInt(row.count),
      0,
    );

    return {
      total_enrolled: totalEnrolled,
      section_distribution: result.map((row) => ({
        section_name: row.section_name || 'Unassigned',
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
    };
  }

  async getFCSEmailStatistics(params: StatisticsQueryDto = {}): Promise<{
    total_applications: number;
    screening_emails_sent: number;
    screening_email_percentage: number;
    schedule_emails_sent: number;
    schedule_email_percentage: number;
    status_emails_sent: number;
    status_email_percentage: number;
    emails_pending: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE app.screening_email_sent = true) as screening_emails_sent,
        COUNT(*) FILTER (WHERE app.passed_exam_email_sent = true) as schedule_emails_sent,
        COUNT(*) FILTER (WHERE app.status_email_sent = true) as status_emails_sent,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.screening_email_sent = true) / 
          NULLIF(COUNT(*), 0),
          2
        ) as screening_email_percentage,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.passed_exam_email_sent = true) / 
          NULLIF(COUNT(*), 0),
          2
        ) as schedule_email_percentage,
        ROUND(
          100.0 * COUNT(*) FILTER (WHERE app.status_email_sent = true) / 
          NULLIF(COUNT(*), 0),
          2
        ) as status_email_percentage,
        COUNT(*) FILTER (
          WHERE app.screening_email_sent = false 
          OR app.passed_exam_email_sent = false 
          OR app.status_email_sent = false
        ) as emails_pending
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }

  async getFCSApplicationTimeline(params: StatisticsQueryDto = {}): Promise<{
    first_application_date: string | null;
    last_application_date: string | null;
    application_duration_days: number | null;
    average_applications_per_day: number;
    peak_application_day: string | null;
    peak_application_count: number;
  }> {
    const { programId, cycleId } = params;

    const query = `
      SELECT 
        TO_CHAR(MIN(app.created_at), 'FMMonth DD, YYYY') AS first_application_date,
        TO_CHAR(MAX(app.created_at), 'FMMonth DD, YYYY') AS last_application_date,
        CASE 
          WHEN MIN(app.created_at) IS NOT NULL AND MAX(app.created_at) IS NOT NULL 
          THEN (MAX(app.created_at) - MIN(app.created_at))
          ELSE NULL 
        END AS application_duration_days,
        ROUND(
          COUNT(*) / 
          NULLIF(EXTRACT(DAY FROM (MAX(app.created_at) - MIN(app.created_at))), 0),
          2
        ) as average_applications_per_day,
        TO_CHAR(app.created_at::date, 'FMMonth DD, YYYY') as application_date,
        COUNT(*) as daily_count
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      WHERE cycle_link.cycle_id = $1
        AND program_link.program_id = $2
      GROUP BY app.created_at::date
      ORDER BY daily_count DESC
      LIMIT 1;
    `;

    const result = await this.dataSource.query(query, [cycleId, programId]);

    if (result.length === 0) {
      return {
        first_application_date: null,
        last_application_date: null,
        application_duration_days: null,
        average_applications_per_day: 0,
        peak_application_day: null,
        peak_application_count: 0,
      };
    }

    return {
      first_application_date: result[0].first_application_date,
      last_application_date: result[0].last_application_date,
      application_duration_days: result[0].application_duration_days,
      average_applications_per_day:
        parseFloat(result[0].average_applications_per_day) || 0,
      peak_application_day: result[0].application_date,
      peak_application_count: parseInt(result[0].daily_count),
    };
  }

  private async getStandardSelectionTimeline(
    params: StatisticsQueryDto = {},
  ): Promise<{
    first_exam_date: Date | null;
    last_interview_date: Date | null;
    selection_duration_days: number | null;
  }> {
    const { programId, cycleId } = params;

    const query = `
  SELECT 
    TO_CHAR(MIN(app.passed_exam_date), 'FMMonth DD, YYYY') AS first_exam_date,
    TO_CHAR(MAX(app.passed_interview_date), 'FMMonth DD, YYYY') AS last_interview_date,
    CASE 
      WHEN MIN(app.passed_exam_date) IS NOT NULL AND MAX(app.passed_interview_date) IS NOT NULL 
      THEN (MAX(app.passed_interview_date) - MIN(app.passed_exam_date))
      ELSE NULL 
    END AS selection_duration_days
  FROM application_news app
  JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
  JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
  WHERE cycle_link.cycle_id = $1
    AND program_link.program_id = $2
    AND app.passed_exam = true
    AND app.passed_interview = true;
`;

    const result = await this.dataSource.query(query, [cycleId, programId]);
    return result[0];
  }
}
