import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
