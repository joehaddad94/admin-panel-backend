import { AdminRole, adminRoleValues } from 'src/core/data/types/admin/roles';
import { ApiProperty } from '@nestjs/swagger';

export class ManualCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: adminRoleValues, enumName: 'UserRole' })
  role: AdminRole;
}
