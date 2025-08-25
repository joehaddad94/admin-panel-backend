import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmailEntryDto {
  @ApiProperty({ description: 'The ID of the application' })
  @IsNotEmpty({ message: 'ID should not be empty' })
  @IsNumber({}, { message: 'ID must be a number' })
  ids: number;

  @ApiProperty({ description: 'The email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString({ message: 'Email must be a string' })
  emails: string;
}

export class SendingEmailsDto {
  @ApiProperty({ description: 'The ID of the cycle' })
  @IsNotEmpty({ message: 'CycleId should not be empty' })
  @IsNumber({}, { message: 'CycleId must be a number' })
  cycleId: number;

  @ApiProperty({
    type: [EmailEntryDto],
    description: 'List of emails with their application IDs',
  })
  @IsArray({ message: 'Emails should be an array' })
  @ArrayNotEmpty({ message: 'No emails provided.' })
  @ValidateNested({ each: true })
  @Type(() => EmailEntryDto)
  emails: EmailEntryDto[];

  @ApiProperty({
    type: String,
    description: 'Optional URL to a file to include as attachment in the email',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Attachment URL must be a valid URL' })
  attachmentUrl?: string;

  @ApiProperty({
    type: String,
    description: 'Optional URL for submission link',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Submission URL must be a valid URL' })
  submissionUrl?: string;

  @ApiProperty({
    type: String,
    description: 'Optional interview date and time (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Interview date time must be a valid date string' })
  interviewDateTime?: string;

  @ApiProperty({
    type: String,
    description: 'Optional URL for orientation info',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Orientation info must be a valid string' })
  orientationInfo?: string;

  @ApiProperty({
    type: String,
    description: 'Optional submission date and time (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Submission date time must be a valid date string' })
  submissionDateTime?: string;
}
