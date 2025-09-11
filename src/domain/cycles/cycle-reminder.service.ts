import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cycles } from '../../core/data/database/entities/cycle.entity';
import { Admin } from '../../core/data/database/entities/admin.entity';
import { MailService } from '../mail/mail.service';
import { addDays, format } from 'date-fns';

@Injectable()
export class CycleReminderService {
  private readonly logger = new Logger(CycleReminderService.name);

  constructor(
    @InjectRepository(Cycles)
    private readonly cycleRepository: Repository<Cycles>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkCycleDateReminders() {
    this.logger.log('Starting cycle date reminder check...');

    try {
      const reminders = await this.getUpcomingCycleReminders();

      if (reminders.length === 0) {
        this.logger.log('No cycle reminders needed today');
        return;
      }

      await this.sendCycleReminderEmails(reminders);
      this.logger.log(`Sent ${reminders.length} cycle reminder emails`);
    } catch (error) {
      this.logger.error('Error checking cycle date reminders:', error);
    }
  }

  /**
   * Gets cycles that are 2 days away from their from_date or to_date
   */
  private async getUpcomingCycleReminders(): Promise<Cycles[]> {
    const today = new Date();
    const twoDaysFromNow = addDays(today, 2);

    // Format dates for database query (YYYY-MM-DD)
    const twoDaysFromNowStr = format(twoDaysFromNow, 'yyyy-MM-dd');

    const cycles = await this.cycleRepository
      .createQueryBuilder('cycle')
      .where(
        '(cycle.from_date = :twoDaysFromNow OR cycle.to_date = :twoDaysFromNow)',
        { twoDaysFromNow: twoDaysFromNowStr },
      )
      .getMany();

    return cycles;
  }

  /**
   * Sends reminder emails to all active admins about upcoming cycles
   */
  private async sendCycleReminderEmails(cycles: Cycles[]): Promise<void> {
    try {
      const admins = ['joe@sefactory.io'];

      if (admins.length === 0) {
        this.logger.warn('No active admins found to send cycle reminders to');
        return;
      }

      const adminEmails = admins.map((admin) => admin);

      // Prepare cycle information for the email
      const cycleInfo = cycles.map((cycle) => ({
        name: cycle.name,
        code: cycle.code,
        fromDate: format(new Date(cycle.from_date), 'MMM dd, yyyy'),
        toDate: format(new Date(cycle.to_date), 'MMM dd, yyyy'),
        daysUntilStart: this.calculateDaysUntil(new Date(cycle.from_date)),
        daysUntilEnd: this.calculateDaysUntil(new Date(cycle.to_date)),
      }));

      // Send bulk email to all admins
      await this.mailService.sendReminderEmails(
        adminEmails,
        'cycle-reminder',
        'Cycle Date Reminder - Action Required',
        {
          cycles: cycleInfo,
          totalCycles: cycles.length,
          reminderDate: format(new Date(), 'MMM dd, yyyy'),
        },
      );

      this.logger.log(
        `Cycle reminder emails sent to ${adminEmails.length} admins`,
      );
    } catch (error) {
      this.logger.error('Error sending cycle reminder emails:', error);
      throw error;
    }
  }

  private calculateDaysUntil(targetDate: Date): number {
    const today = new Date();
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  async getUpcomingCycles(): Promise<Cycles[]> {
    return this.getUpcomingCycleReminders();
  }
}
