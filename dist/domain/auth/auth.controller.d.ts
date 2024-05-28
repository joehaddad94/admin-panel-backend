import { AuthMediator } from './auth.mediator';
import { InviteDto } from './dto/invite.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ManualCreateDto } from './dto/manual.create.dto';
export declare class AuthController {
    private readonly mediator;
    constructor(mediator: AuthMediator);
    invite(data: InviteDto): Promise<any>;
    login(data: LoginDto): Promise<any>;
    verify(data: VerifyDto): Promise<any>;
    manualCreate(data: ManualCreateDto): Promise<any>;
}
