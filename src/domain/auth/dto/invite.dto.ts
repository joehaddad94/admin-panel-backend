import { ApiProperty } from '@nestjs/swagger';
import { adminRoleValues, AdminRole } from '../../../core/data/types';

export class InviteDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: adminRoleValues, enumName: 'UserRole' })
  role: AdminRole;
}
