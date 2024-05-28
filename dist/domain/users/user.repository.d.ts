import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { User } from '@core/data/database';
import { Repository } from 'typeorm';
export declare class UserRepository extends BaseRepository<User> {
    constructor(userRepository: Repository<User>);
}
