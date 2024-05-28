import { BaseEntity } from 'typeorm';
import { Information } from '../entities/information.entity';
import { User } from '../entities/user.entity';
export declare class InformationUser extends BaseEntity {
    id: number;
    info_id: number;
    user_id: number;
    information: Information;
    user: User;
}
