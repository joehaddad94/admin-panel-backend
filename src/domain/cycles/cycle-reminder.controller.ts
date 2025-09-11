import {
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CycleReminderMediator } from './cycle-reminder.mediator';

@ApiTags('cycle-reminders')
@Controller('cycles/reminders')
export class CycleReminderController {
  constructor(private readonly mediator: CycleReminderMediator) {}

  /**
   * Manually trigger cycle reminders (for testing)
   * POST /cycles/reminders/trigger
   */
  @Post('trigger')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  triggerReminders() {
    return this.mediator.triggerReminders();
  }
}
