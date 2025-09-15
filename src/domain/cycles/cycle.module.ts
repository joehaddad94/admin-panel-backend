import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';
import { Admin } from 'src/core/data/database/entities/admin.entity';
import { CycleController } from './cycle.controller';
import { CycleReminderController } from './cycle-reminder.controller';
import { CycleMediator } from './cycle.mediator';
import { CycleReminderMediator } from './cycle-reminder.mediator';
import { CycleRepository } from './cycle.repository';
import { CycleService } from './cycle.service';
import { CycleReminderService } from './cycle-reminder.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import AuthMiddleware from '../../core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';
import { ProgramModule } from '../programs/program.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cycles, Admin, CycleRepository]),
    ScheduleModule.forRoot(),
    AuthModule,
    ProgramModule,
    MailModule,
  ],
  controllers: [CycleController, CycleReminderController],
  providers: [
    CycleMediator,
    CycleReminderMediator,
    CycleRepository,
    CycleService,
    CycleReminderService,
    JwtStrategy,
  ],
  exports: [CycleRepository, CycleService, CycleReminderService],
})
export class CycleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CycleController);
  }
}
