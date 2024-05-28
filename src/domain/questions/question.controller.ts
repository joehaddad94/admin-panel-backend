import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuestionMediator } from './question.mediator';
import { CreateQuestionDto } from './dtos/create.question.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  QuestionResponse,
  DeleteResponse,
} from '../../core/config/documentation';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly mediator: QuestionMediator) {}

  @ApiResponse({
    type: [QuestionResponse],
  })
  @Get()
  getQuestions() {
    return this.mediator.findQuestions();
  }

  @ApiResponse({
    type: QuestionResponse,
  })
  @Post()
  createQuiz(@Body() data: CreateQuestionDto) {
    return this.mediator.create(data);
  }

  @ApiResponse({
    type: DeleteResponse,
  })
  @Delete(':id')
  deleteQuiz(@Param('id') id: number) {
    return this.mediator.delete(id);
  }
}
