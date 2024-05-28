import { MailerService } from '@nestjs-modules/mailer';
import { Admin } from '@core/data/database/entities/admin.entity';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendRegistractionMail: (user: Admin) => Promise<void>;
}
