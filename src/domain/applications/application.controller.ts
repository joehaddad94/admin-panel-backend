import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationMediator } from './application.mediator';
import { ApiTags } from '@nestjs/swagger';
import { FiltersDto } from '../reports/dtos/filters.dto';
import { SendingEmailsDto } from './dtos/sending.emails.dto';
import { ExamScoresDto } from './dtos/exam.scores.dto';
import {
  EditApplicationDto,
  EditApplicationsDto,
  EditFCSApplicationsDto,
  RowEditApplicationDto,
} from './dtos/edit.applications.dto';
import { InterviewScoresDto } from './dtos/interview.scores.dto';
import { ApplyToFSEDto } from './dtos/apply.fse.dto';
import { ImportFCSDto } from './dtos/Import.fcs.data.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  findApplications(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplications(filtersDto);
  }

  @Post('new')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  findApplicationsNew(@Body() filtersDto: FiltersDto) {
    console.log('🔍 Controller received body:', JSON.stringify(filtersDto, null, 2));
    return this.mediator.findApplicationsNew(filtersDto);
  }

  @Post('get-by-last-cycle')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getApplicationsByLatestCycle(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplicationsByLatestCycle(filtersDto);
  }

  @Post('edit-application')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  editApplication(@Body() data: EditApplicationDto) {
    return this.mediator.editApplication(data);
  }

  @Post('row-edit-applications')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  rowEditApplication(@Body() data: RowEditApplicationDto) {
    return this.mediator.rowEditApplications(data);
  }

  @Post('edit-fcs-applications')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  editFCSApplications(@Body() data: EditFCSApplicationsDto) {
    return this.mediator.editFCSApplications(data);
  }

  @Post('edit-applications')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  editApplications(@Body() data: EditApplicationsDto) {
    return this.mediator.editApplications(data);
  }

  @Post('post-screening-mails')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendPostScreeningEmails(@Body() data: SendingEmailsDto) {
    return this.mediator.sendPostScreeningEmails(data);
  }

  @Post('import-exam-scores')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  importExamScores(@Body() data: ExamScoresDto) {
    return this.mediator.importExamScores(data);
  }

  @Post('send-passed-exam-emails')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendInterviewDateEmails(@Body() data: SendingEmailsDto) {
    return this.mediator.sendPassedExamEmails(data);
  }

  @Post('import-interview-scores')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  importInterviewScores(@Body() data: InterviewScoresDto) {
    return this.mediator.importInterviewScores(data);
  }

  @Post('send-status-emails')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendStatusEmails(@Body() data: SendingEmailsDto) {
    return this.mediator.sendStatusEmail(data);
  }

  @Post('send-schedule-emails')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendScheduleConfirmationEmails(@Body() data: SendingEmailsDto) {
    return this.mediator.sendScheduleConfirmationEmails(data);
  }

  @Post('apply-to-fse')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  applyToFSE(@Body() data: ApplyToFSEDto) {
    return this.mediator.applyToFSE(data);
  }

  @Post('import-fcs-data')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  importFCSData(@Body() data: ImportFCSDto) {
    return this.mediator.importFCSData(data);
  }
}
