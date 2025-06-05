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
    const {
      programAbbreviation = 'FSE',
      cycleOffset = 1,
      cycleNamePattern = 'FSE%',
    } = params;

    const query = `
      SELECT c.name AS cycle_name, app.status, COUNT(*) AS count
      FROM application_news app
      JOIN application_news_cycle_id_links cycle_link ON app.id = cycle_link.application_new_id
      JOIN cycles c ON cycle_link.cycle_id = c.id
      JOIN application_news_program_id_links program_link ON app.id = program_link.application_new_id
      JOIN programs p ON program_link.program_id = p.id
      WHERE app.status IS NOT NULL
      AND p.abbreviation = $1
      AND c.id = (
          SELECT id
          FROM cycles
          WHERE name LIKE $2
          ORDER BY from_date DESC
          OFFSET $3 LIMIT 1
        )
      GROUP BY c.name, app.status
      ORDER BY count DESC;
    `;

    return this.dataSource.query(query, [
      programAbbreviation,
      cycleNamePattern,
      cycleOffset,
    ]);
  }
}
