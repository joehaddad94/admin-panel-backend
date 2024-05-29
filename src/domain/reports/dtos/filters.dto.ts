import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from './report-type.enum';

export class FiltersDto {
  @ApiProperty()
  fromDate?: Date;

  @ApiProperty()
  toDate?: Date;

  @ApiProperty()
  programId?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty({ enum: ReportType })
  reportType?: ReportType;
}
