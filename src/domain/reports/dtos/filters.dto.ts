import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from './report-type.enum';
import { IsNumber, IsOptional } from 'class-validator';

export class FiltersDto {
  @ApiProperty()
  fromDate?: Date;

  @ApiProperty()
  toDate?: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  programId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ enum: ReportType })
  reportType?: ReportType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cycleId?: number;

  @ApiProperty()
  @IsOptional()
  useAllCycles?: boolean;

  @ApiProperty()
  @IsOptional()
  microcampId?: number;
}
