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
} from './dtos/edit.applications.dto';
import { InterviewScoresDto } from './dtos/interview.scores.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getApplicationsByProgamId(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplications(filtersDto);
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
}
