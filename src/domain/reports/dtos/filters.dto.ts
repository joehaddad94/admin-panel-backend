import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from './report-type.enum';
import { IsNumber, IsOptional, IsString, IsArray, IsEnum, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export class FilterDto {
  @ApiProperty({ description: 'Field to filter on' })
  @IsString()
  field: string;

  @ApiProperty({ enum: FilterOperator, description: 'Filter operator' })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @ApiProperty({ description: 'Filter value' })
  value: any;
}

export class SortDto {
  @ApiProperty({ description: 'Field to sort by' })
  @IsString()
  field: string;

  @ApiProperty({ enum: SortDirection, description: 'Sort direction' })
  @IsEnum(SortDirection)
  sort: SortDirection;
}

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

  @ApiProperty({ description: 'Search term for filtering applications by name, email, or other fields' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ type: [FilterDto], description: 'Array of filters to apply' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters?: FilterDto[];

  @ApiProperty({ type: [SortDto], description: 'Array of sort criteria' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[];
}
