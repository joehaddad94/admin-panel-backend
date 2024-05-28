import { BaseService } from '@core/settings/base/service/base.service';
import { AuthRepository } from '@domain/auth/auth.repository';
import { Admin } from '@core/data/database';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService extends BaseService<AuthRepository, Admin> {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    hashPassword: (password: string) => Promise<string>;
    comparePassword: (password: string, hashed: string) => Promise<boolean>;
    verifyEmail: (email: string) => boolean;
    generateLink: (email: string) => Promise<{
        link: string;
        key: string;
    }>;
    generateToken: (user: Admin) => Promise<string>;
}
