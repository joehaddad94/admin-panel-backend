import { ApiProperty } from '@nestjs/swagger';

export class DataMigrationDto {
  @ApiProperty()
  sourceFilePath?: string;

  @ApiProperty()
  targetFilePath?: string;

  @ApiProperty()
  category?: string;
}
