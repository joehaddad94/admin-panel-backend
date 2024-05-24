import { AdminRole, adminRoleValues } from '@core/data/types/admin/roles';
import { ApiProperty } from '@nestjs/swagger';

export class AdminResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: adminRoleValues })
  role: AdminRole;

  @ApiProperty()
  inActive: boolean;
}

export class TokenResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: AdminResponse })
  user: AdminResponse;
}

export class InviteResponse {
  @ApiProperty()
  link: string;
}
