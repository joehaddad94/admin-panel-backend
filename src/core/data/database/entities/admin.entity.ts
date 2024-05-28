import { AdminRole, adminRoleValues } from 'src/core/data/types/admin/roles';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  password?: string;

  @Column({ enum: adminRoleValues })
  role: AdminRole;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationKey?: string;
}
