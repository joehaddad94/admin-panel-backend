import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class GetCyclesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'programId must be provided' })
  programId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumberString({}, { message: 'page must be a number' })
  page = 1;

  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @IsNumberString({}, { message: 'pageSize must be a number' })
  pageSize = 100;
}
