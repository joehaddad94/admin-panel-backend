import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImportDataItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  score?: number;
}

export class ImportDataDto {
  @ApiProperty()
  @IsNotEmpty()
  cycleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  importType: string;

  @ApiProperty({ type: [ImportDataItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportDataItemDto)
  data: ImportDataItemDto[];
}
