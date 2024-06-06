import { ApiProperty } from '@nestjs/swagger';
// import { AdminRole, adminRoleValues } from '../../../data/types';

export class AdminResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  // @ApiProperty({ enum: adminRoleValues })
  // role: AdminRole;

  @ApiProperty()
  inActive: boolean;
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
