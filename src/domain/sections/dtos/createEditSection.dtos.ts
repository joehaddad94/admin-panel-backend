import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateEditSectionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cycleId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sectionId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sectionName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  days?: string;
  
  @ApiProperty()
  @IsOptional()
  courseTimeStart?: Date;

  @ApiProperty()
  @IsOptional()
  courseTimeEnd?: Date;
}
