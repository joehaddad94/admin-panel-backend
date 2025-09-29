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
    private readonly mailService: MailService,
  ) {}

  @Cron('0 9 * * *', {
    timeZone: 'Asia/Beirut'
  })
  async checkCycleDateReminders() {
    // Only run in production environment
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log('Skipping cycle reminder check - not in production environment');
      return;
    }

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
   * Gets cycles that ended between 2 days ago and today (for reminder notifications)
   */
  private async getUpcomingCycleReminders(): Promise<Cycles[]> {
    const today = new Date();
    const twoDaysFromNow = addDays(today, 2);

    // Format dates for database query (YYYY-MM-DD)
    const todayStr = format(today, 'yyyy-MM-dd');
    const twoDaysFromNowStr = format(twoDaysFromNow, 'yyyy-MM-dd');

    const cycles = await this.cycleRepository
      .createQueryBuilder('cycle')
      .where('cycle.to_date >= :today AND cycle.to_date <= :twoDaysFromNow', { 
        today: todayStr,
        twoDaysFromNow: twoDaysFromNowStr
      })
      .getMany();

    return cycles;
  }

  /**
   * Sends reminder emails to specific admins based on cycle type
   */
  private async sendCycleReminderEmails(cycles: Cycles[]): Promise<void> {
    try {
      // Group cycles by type
      const fseCycles = cycles.filter(cycle => cycle.code.includes('FSE'));
      const fcsCycles = cycles.filter(cycle => cycle.code.includes('FCS'));
      const uixCycles = cycles.filter(cycle => cycle.code.includes('UIX'));

      // Send emails based on cycle types
      const emailPromises = [];

      // Send FSE cycles to Sarah
      if (fseCycles.length > 0) {
        const fseCycleInfo = fseCycles.map((cycle) => ({
          name: cycle.name,
          code: cycle.code,
          fromDate: format(new Date(cycle.from_date), 'MMM dd, yyyy'),
          toDate: format(new Date(cycle.to_date), 'MMM dd, yyyy'),
          daysUntilStart: this.calculateDaysUntil(new Date(cycle.from_date)),
          daysUntilEnd: this.calculateDaysUntil(new Date(cycle.to_date)),
        }));

        emailPromises.push(
          this.mailService.sendReminderEmails(
            ['sarah@sefactory.io'],
            'cycle-reminder',
            'FSE Cycle Ended Reminder - Action Required',
            {
              cycles: fseCycleInfo,
              totalCycles: fseCycles.length,
              reminderDate: format(new Date(), 'MMM dd, yyyy'),
              cycleType: 'FSE',
            },
            ['joe@sefactory.io'] // CC Joe
          )
        );
      }

      // Send FCS and UIX cycles to Maria
      const fcsUixCycles = [...fcsCycles, ...uixCycles];
      if (fcsUixCycles.length > 0) {
        const fcsUixCycleInfo = fcsUixCycles.map((cycle) => ({
          name: cycle.name,
          code: cycle.code,
          fromDate: format(new Date(cycle.from_date), 'MMM dd, yyyy'),
          toDate: format(new Date(cycle.to_date), 'MMM dd, yyyy'),
          daysUntilStart: this.calculateDaysUntil(new Date(cycle.from_date)),
          daysUntilEnd: this.calculateDaysUntil(new Date(cycle.to_date)),
        }));

        emailPromises.push(
          this.mailService.sendReminderEmails(
            ['maria@sefactory.io'],
            'cycle-reminder',
            'FCS/UIX Cycle Ended Reminder - Action Required',
            {
              cycles: fcsUixCycleInfo,
              totalCycles: fcsUixCycles.length,
              reminderDate: format(new Date(), 'MMM dd, yyyy'),
              cycleType: 'FCS/UIX',
            },
            ['joe@sefactory.io'] // CC Joe
          )
        );
      }

      // Wait for all emails to be sent
      await Promise.all(emailPromises);

      this.logger.log(
        `Cycle reminder emails sent: ${fseCycles.length} FSE cycles to Sarah, ${fcsUixCycles.length} FCS/UIX cycles to Maria, CC'd Joe on all emails`,
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
