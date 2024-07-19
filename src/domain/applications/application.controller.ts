import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationMediator } from './application.mediator';
import { ApiTags } from '@nestjs/swagger';
import { FiltersDto } from '../reports/dtos/filters.dto';
import { PostScreeningDto } from './dtos/post.screening.dto';
import { ExamScoresDto } from './dtos/exam.scores.dto';
import { EditApplicationsDto } from './dtos/edit.applications.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getApplicationsByProgamId(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplications(filtersDto);
  }

  @Post('edit-application')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  editApplications(@Body() data: EditApplicationsDto) {
    return this.mediator.editApplications(data);
  }

  @Post('post-screening-mails')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendPostScreeningEmails(@Body() data: PostScreeningDto) {
    return this.mediator.sendPostScreeningEmails(data);
  }

  @Post('import-exam-scores')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  importExamScores(@Body() data: ExamScoresDto) {
    return this.mediator.importExamScores(data);
  }

  // @Post('import-exam-scores')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: memoryStorage(),
  //   }),
  // )
  // async importExamScores(
  //   @Body() data: ExamScoresDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   if (!file) {
  //     throw new Error('File is not uploaded');
  //   }
  //   console.log(data);
  //   console.log('Uploaded file:', file);
  //   return this.mediator.importExamScores(data, file.buffer);
  // }
}
