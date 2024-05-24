import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponse {
  @ApiProperty()
  affected: number;
}

export class UpdateResponse {
  @ApiProperty()
  affected: number;
}
