import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
}
