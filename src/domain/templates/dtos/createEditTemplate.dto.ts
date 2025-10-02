import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';

export class CreateEditTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  templateId?: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  designJson: object;

  @ApiProperty()
  @IsString()
  htmlContent: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  createdById?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  updatedById?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  programId?: number;
}
