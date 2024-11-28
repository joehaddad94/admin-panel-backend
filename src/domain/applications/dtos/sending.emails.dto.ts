import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsString,
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
}
