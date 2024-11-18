import { Controller, Post, Body, Logger } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Post('send-test-email')
  async sendTestEmail(@Body() body: { email: string; template: string }) {
    const { email, template } = body;

    try {
      const result = await this.mailService.sendTestEmail(email, template);
      return { message: `Email sent successfully: ${result}` };
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      return { error: `Failed to send email: ${error.message}` };
    }
  }
}
