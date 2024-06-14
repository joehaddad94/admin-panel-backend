import { ApiProperty } from '@nestjs/swagger';

export class AdminResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;
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
