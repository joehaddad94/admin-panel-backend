import { AdminRole } from '@core/data/types/admin/roles';
export declare class AdminResponse {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    inActive: boolean;
}
export declare class TokenResponse {
    token: string;
    user: AdminResponse;
}
export declare class InviteResponse {
    link: string;
}
