import { AdminRole } from '@core/data/types/admin/roles';
import { BaseEntity } from 'typeorm';
export declare class Admin extends BaseEntity {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: AdminRole;
    isActive: boolean;
    verificationKey?: string;
}
