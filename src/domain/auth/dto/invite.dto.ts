import { AdminRole, adminRoleValues } from 'src/core/data/types/admin/roles';
import { ApiProperty } from '@nestjs/swagger';

export class InviteDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: adminRoleValues, enumName: 'UserRole' })
  role: AdminRole;
}
