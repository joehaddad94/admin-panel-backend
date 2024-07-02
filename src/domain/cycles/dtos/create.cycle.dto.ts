import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCycleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'program_id must be provided' })
  programId: number;

  @ApiProperty()
  @IsDateString({}, { message: 'from_date must be a valid date string' })
  @IsNotEmpty({ message: 'from_date must be provided' })
  fromDate: Date;

  @ApiProperty()
  @IsDateString({}, { message: 'to_date must be a valid date string' })
  @IsNotEmpty({ message: 'to_date must be provided' })
  toDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'cycle_name must be provided' })
  cycleName: string;
}
