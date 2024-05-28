import { LoginDto, InviteDto } from '@domain/auth';
import { AuthService } from '@domain/auth/auth.service';
import { VerifyDto } from '@domain/auth/dto/verify.dto';
import { ManualCreateDto } from '@domain/auth';
import { MailService } from '@domain/mail/mail.service';
export declare class AuthMediator {
    private readonly service;
    private readonly mailService;
    constructor(service: AuthService, mailService: MailService);
    invite: (data: InviteDto) => Promise<any>;
    verify: (data: VerifyDto) => Promise<any>;
    login: (data: LoginDto) => Promise<any>;
    manualCreate: (data: ManualCreateDto) => Promise<any>;
}
