import { UserService } from './user.service';
export declare class UserMediator {
    private readonly service;
    constructor(service: UserService);
    findUsers: () => Promise<any>;
}
