import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCycleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'programId must be provided' })
  programId: number;

  @ApiProperty()
  @IsDateString({}, { message: 'fromDate must be a valid date string' })
  @IsNotEmpty({ message: 'fromDate must be provided' })
  fromDate: Date;

  @ApiProperty()
  @IsDateString({}, { message: 'toDate must be a valid date string' })
  @IsNotEmpty({ message: 'toDate must be provided' })
  toDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'cycleName must be provided' })
  cycleName: string;
}
