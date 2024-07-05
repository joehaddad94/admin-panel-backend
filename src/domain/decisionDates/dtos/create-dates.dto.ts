import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDecisionDateDto {
  @ApiProperty()
  @IsDateString({}, { message: 'examDate must be a valid date string' })
  @IsNotEmpty({ message: 'examDate must be provided' })
  examDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'cycleId must be provided' })
  cycleId: number;
}
