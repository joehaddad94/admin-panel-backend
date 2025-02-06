import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class EditApplicationsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID must be provided' })
  @IsInt({ message: 'ID must be an integer' })
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  isEligible?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Exam score must be a number' })
  @Min(0, { message: 'Exam score must be at least 0' })
  @Max(100, { message: 'Exam score must be at most 100' })
  examScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Technical interview score must be a number' })
  @Min(0, { message: 'Technical interview score must be at least 0' })
  @Max(100, { message: 'Technical interview score must be at most 100' })
  techInterviewScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Soft interview score must be a number' })
  @Min(0, { message: 'Soft interview score must be at least 0' })
  @Max(100, { message: 'Soft interview score must be at most 100' })
  softInterviewScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  remarks?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @MinLength(1, { message: 'Status must be at least 1 character long' })
  @MaxLength(50, { message: 'Status must be at most 50 characters long' })
  applicationStatus?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Cycle Id must be provided' })
  @IsNumber({}, { message: 'Cycle Id must be a number' })
  cycleId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Cycle Id must be a number' })
  inputCycleId: number;
}
