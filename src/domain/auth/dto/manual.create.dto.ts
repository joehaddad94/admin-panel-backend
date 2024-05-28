import { ApiProperty } from '@nestjs/swagger';
import { adminRoleValues, AdminRole } from '../../../core/data/types';

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
