/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';

export class AdminResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  is_active: boolean;
}

export class TokenResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: AdminResponse })
  name: string;

  @ApiProperty({ type: AdminResponse })
  user: AdminResponse;
}

export class InviteResponse {
  @ApiProperty()
  link: string;
}
