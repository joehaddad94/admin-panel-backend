import { AdminRole, adminRoleValues } from '@core/data/types/admin/roles';
import { ApiProperty } from '@nestjs/swagger';

export class InviteDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: adminRoleValues, enumName: 'UserRole' })
  role: AdminRole;
}
