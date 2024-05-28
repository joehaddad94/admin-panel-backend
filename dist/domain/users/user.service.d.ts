import { BaseService } from '@core/settings/base/service/base.service';
import { User } from '@core/data/database';
import { UserRepository } from './user.repository';
export declare class UserService extends BaseService<UserRepository, User> {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
}
