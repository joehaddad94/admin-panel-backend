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
}
