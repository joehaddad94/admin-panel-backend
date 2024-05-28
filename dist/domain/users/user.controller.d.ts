import { UserMediator } from './user.mediator';
export declare class UserController {
    private readonly mediator;
    constructor(mediator: UserMediator);
    getUsers(): Promise<any>;
}
