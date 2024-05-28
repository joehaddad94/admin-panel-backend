import { Admin } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';
export declare class AuthRepository extends BaseRepository<Admin> {
    constructor(authRepository: Repository<Admin>);
}
