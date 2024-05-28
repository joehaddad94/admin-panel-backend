import { BaseEntity } from 'typeorm';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
export declare class ApplicationUser extends BaseEntity {
    id: number;
    application_new_id: number;
    user_id: number;
    application: Application;
    user: User;
}
