import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ApplicationId {
  @ApiProperty()
  @IsNotEmpty({ message: 'User ID must be provided' })
  @IsInt({ message: 'User ID must be an integer' })
  userId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Info ID must be provided' })
  @IsInt({ message: 'Info ID must be an integer' })
  infoId: number;
}

export class ApplyToFSEDto {
  @ApiProperty({ type: [ApplicationId] })
  @IsNotEmpty({ message: 'Selected applications must be provided' })
  @IsArray({ message: 'Selected applications must be an array' })
  @Type(() => ApplicationId)
  selectedApplicationsIds: ApplicationId[];

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt({ message: 'Targeted FSE cycle ID must be an integer' })
  targetedFSECycleId: number | null;
}
