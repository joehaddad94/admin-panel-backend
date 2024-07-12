import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationMediator } from './application.mediator';
import { ApiTags } from '@nestjs/swagger';
import { FiltersDto } from '../reports/dtos/filters.dto';
import { PostScreeningDto } from './dtos/post.screening.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getApplicationsByProgamId(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplications(filtersDto);
  }

  @Post('post-screening-mail')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendPostScreeningEmails(@Body() data: PostScreeningDto) {
    return this.mediator.sendPostScreeningEmails(data);
  }
}
