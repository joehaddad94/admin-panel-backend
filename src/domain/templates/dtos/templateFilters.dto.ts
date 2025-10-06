import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteTemplatesDto {
  @ApiProperty({ description: 'Array of template IDs to delete' })
  @IsArray()
  @IsString({ each: true })
  templateIds: string[];
}

export class GetTemplatesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  @IsNumber()
  programId?: number;
}
