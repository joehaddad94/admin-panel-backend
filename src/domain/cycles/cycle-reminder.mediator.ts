import { Injectable } from '@nestjs/common';
import { CycleReminderService } from './cycle-reminder.service';
import { catcher } from 'src/core/helpers/operation';

@Injectable()
export class CycleReminderMediator {
  constructor(private readonly cycleReminderService: CycleReminderService) {}

  /**
   * Manually trigger cycle reminders
   */
  triggerReminders = async () => {
    return catcher(async () => {
      await this.cycleReminderService.checkCycleDateReminders();

      return {
        message: 'Cycle reminders triggered successfully',
        timestamp: new Date().toISOString(),
      };
    });
  };
}
