import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizMediator } from 'src/domain/quizes/quiz.mediator';
import { CreateQuizDto } from './dtos/create.quiz.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizResponse } from 'src/core/config/documentation';

@ApiTags('quizes')
@Controller('quizes')
export class QuizController {
  constructor(private readonly mediator: QuizMediator) {}

  @ApiResponse({
    type: [QuizResponse],
  })
  @Get()
  getQuizes() {
    return this.mediator.findQuizes();
  }

  @ApiResponse({
    type: QuizResponse,
  })
  @Post()
  createQuiz(@Body() data: CreateQuizDto) {
    return this.mediator.create(data);
  }
}
