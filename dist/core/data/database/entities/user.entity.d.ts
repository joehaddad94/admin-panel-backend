import { BaseEntity } from 'typeorm';
import { ApplicationUser } from '../relations/application-user.entity';
import { InformationUser } from '../relations/information-user.entity';
export declare class User extends BaseEntity {
    id: number;
    username: string;
    email: string;
    provider: string;
    password: string;
    reset_password_token: string;
    confirmation_token: string;
    confirmed: boolean;
    blocked: boolean;
    first_name: string;
    last_name: string;
    sef_id: string;
    login_attempts: number;
    created_at: Date;
    updated_at: Date;
    created_by_id: number;
    updated_by_id: number;
    applicationUser: ApplicationUser[];
    informationUser: InformationUser[];
}
