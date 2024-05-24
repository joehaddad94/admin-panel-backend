import { ApiProperty } from '@nestjs/swagger';

export class FiltersDto {
  @ApiProperty()
  fromDate?: Date;

  @ApiProperty()
  toDate?: Date;

  @ApiProperty()
  programId?: number;
}
