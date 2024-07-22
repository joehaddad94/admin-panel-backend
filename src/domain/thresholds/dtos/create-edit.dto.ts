import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateEditThresholdsDto {
  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'examPassingGrade must be at least 0' })
  @Max(20, { message: 'examPassingGrade must be at most 20' })
  examPassingGrade?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'weightTech must be at least 0' })
  @Max(1, { message: 'weightTech must be at most 1' })
  weightTech?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'weightSoft must be at least 0' })
  @Max(1, { message: 'weightSoft must be at most 1' })
  weightSoft?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'primaryPassingGrade must be at least 0' })
  @Max(20, { message: 'primaryPassingGrade must be at most 20' })
  primaryPassingGrade?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'secondaryPassingGrade must be at least 0' })
  @Max(20, { message: 'secondaryPassingGrade must be at most 20' })
  secondaryPassingGrade?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'cycleId must be provided' })
  cycleId: number;

  @ApiProperty()
  thresholdId?: number;
}
